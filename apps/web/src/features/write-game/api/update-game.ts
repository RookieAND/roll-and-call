"use server";

import {
  listParticipantUserIds,
  listRosterStatuses,
  lockGame,
  updateOwnedGame,
} from "@roll-and-call/database/games";
import { createNotifications } from "@roll-and-call/database/notifications";
import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { withTransaction } from "@roll-and-call/database/transaction";
import { isNull } from "es-toolkit";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { PARTICIPANT_STATUS, SCHEDULE_MODE } from "@/entities/game";
import { type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import {
  getActingMember,
  notifySessionConfirmed,
  refreshRecruitPost,
  removeUnusedGameFiles,
  notMemberError,
} from "@/shared/server";

import { EDIT_FORBIDDEN_MESSAGE, editBlockReason } from "../model/edit-block-reason";
import { gameFormSchema, type GameFormValues } from "../model/game-form";
import { invalidInputResult } from "../model/invalid-input-result";
import { reopensMinPlayersJudgement } from "../model/reopens-min-players-judgement";
import { sessionTimeChanged } from "../model/session-time-change";
import { toGameColumns } from "../model/to-game-columns";

export async function updateGame(id: string, input: GameFormValues): Promise<ActionResult> {
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  const parsed = gameFormSchema.safeParse(input);
  if (!parsed.success) {
    return invalidInputResult(parsed.error.issues[0]);
  }
  const values = parsed.data;
  const columns = toGameColumns(values);
  const owner = { serverId: server.id, gameId: id, gmId: user.id };

  // 같은 구인의 신청·명단 조정·추첨과 줄을 서도록 행을 잠그고 검사와 저장을 한 번에 한다.
  const result = await withTransaction(async (transaction) => {
    const game = await lockGame({ transaction, serverId: server.id, gameId: id });
    const roster = await listRosterStatuses({ transaction, serverId: server.id, gameId: id });
    const block = editBlockReason({
      game,
      userId: user.id,
      columns,
      rosterCount: roster.length,
      confirmedCount: roster.filter((status) => status === PARTICIPANT_STATUS.confirmed).length,
    });
    if (block || !game) return block ?? { error: EDIT_FORBIDDEN_MESSAGE };

    // 신청자 없이 일시 지정형을 조율형으로 바꾸면 예전 세션 시각을 지운다.
    const clearsSession =
      game.scheduleMode === SCHEDULE_MODE.fixed &&
      columns.scheduleMode === SCHEDULE_MODE.coordinate;
    const timeChanged = sessionTimeChanged({
      scheduleMode: columns.scheduleMode,
      previous: game.confirmedAt,
      next: columns.confirmedAt,
    });
    // 마감을 미래로 고치면 새 마감 때 최소 인원을 다시 판정한다.
    const reopensJudgement = reopensMinPlayersJudgement({
      previousEndDate: game.endDate,
      nextEndDate: columns.endDate,
      now: new Date(),
    });
    // 시간이 실제로 바뀔 때만 1시간 전 리마인더 기록을 지워 새 시간에 다시 보낸다.
    const updated = await updateOwnedGame({
      transaction,
      ...owner,
      columns: {
        ...columns,
        ...(clearsSession ? { confirmedAt: null } : {}),
        ...(timeChanged ? { notifiedAt: null } : {}),
        ...(reopensJudgement ? { minPlayersJudgedAt: null } : {}),
      },
    });
    if (!updated) return { error: EDIT_FORBIDDEN_MESSAGE };

    if (timeChanged && game.confirmedAt && columns.confirmedAt) {
      const confirmedIds = await listParticipantUserIds({
        transaction,
        serverId: server.id,
        gameId: id,
        status: PARTICIPANT_STATUS.confirmed,
      });
      const params = {
        gameId: id,
        gameTitle: columns.title,
        previousStartsAt: game.confirmedAt.toISOString(),
        startsAt: columns.confirmedAt.toISOString(),
      };
      await createNotifications({
        executor: transaction,
        serverId: server.id,
        actorId: user.id,
        notifications: confirmedIds.map((userId) => ({
          userId,
          kind: NOTIFICATION_KIND.sessionTimeChanged,
          params,
        })),
      });
    }
    return { before: game, timeChanged };
  });
  if ("error" in result) return result;
  const { before, timeChanged } = result;

  after(async () => {
    await refreshRecruitPost({
      server,
      gameId: id,
      thumbnailChanged:
        (values.thumbnailUrl ?? null) !== before.thumbnailUrl ||
        values.thumbnailSpoiler !== before.thumbnailSpoiler,
    });
    if (timeChanged) {
      await notifySessionConfirmed({ server, gameId: id, previousConfirmedAt: before.confirmedAt });
    }
  });

  const kept = new Set<string>([values.thumbnailUrl ?? "", ...values.images]);
  await removeUnusedGameFiles({
    serverId: server.id,
    urls: [before.thumbnailUrl, ...before.images].filter((url) => !isNull(url) && !kept.has(url)),
  });

  redirect(serverPath({ slug: server.slug, path: `/games/${id}` }));
}
