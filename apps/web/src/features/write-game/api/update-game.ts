"use server";

import { getRulebookRecords } from "@roll-and-call/database/certifications";
import {
  listParticipantUserIds,
  listRosterStatuses,
  lockGame,
  updateOwnedGame,
} from "@roll-and-call/database/games";
import { createNotifications } from "@roll-and-call/database/notifications";
import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { syncGameSupplementRequests } from "@roll-and-call/database/rulebooks";
import { withTransaction } from "@roll-and-call/database/transaction";
import { isNull } from "es-toolkit";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { GAME_VISIBILITY, PARTICIPANT_STATUS, SCHEDULE_MODE } from "@/entities/game";
import { removeUnusedGameFiles } from "@/entities/game/server";
import { isCertEnforced, ruleSetOf, toMyRulebooks } from "@/entities/rulebook";
import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import {
  getActingMember,
  notifySessionConfirmed,
  refreshRecruitPost,
  notMemberError,
  resolveNoticeLinkLabels,
} from "@/shared/server";

import { checkSupplements } from "../model/check-supplements";
import { EDIT_FORBIDDEN_MESSAGE, editBlockReason } from "../model/edit-block-reason";
import { gameFormSchema, type GameFormValues } from "../model/game-form";
import { hasThumbnailChanged } from "../model/has-thumbnail-changed";
import { invalidInputResult } from "../model/invalid-input-result";
import { manualSupplementNames } from "../model/manual-supplement-names";
import { reopensMinPlayersJudgement } from "../model/reopens-min-players-judgement";
import { sessionTimeChanged } from "../model/session-time-change";
import { toGameColumns } from "../model/to-game-columns";
import { toPrivateColumns } from "../model/to-private-columns";

export async function updateGame(id: string, input: GameFormValues): Promise<ActionResult> {
  const parsedId = parseActionInput(idSchema, id);
  if (!parsedId.ok) return parsedId.result;

  const parsed = gameFormSchema.safeParse(input);
  if (!parsed.success) {
    return invalidInputResult(parsed.error.issues[0]);
  }

  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;
  const values = parsed.data;
  const formColumns = toGameColumns(values);
  // 디스코드를 부르므로 행을 잠그는 트랜잭션 밖에서 미리 가져온다.
  const linkLabels = await resolveNoticeLinkLabels({
    guildId: server.discordGuildId,
    notice: formColumns.notice,
  });
  const owner = { serverId: server.id, gameId: id, gmId: user.id };
  const myRulebooks = toMyRulebooks(
    await getRulebookRecords({ serverId: server.id, userId: user.id }),
  );

  // 같은 구인의 신청·명단 조정·추첨과 줄을 서도록 행을 잠그고 검사와 저장을 한 번에 한다.
  const result = await withTransaction(async (transaction) => {
    const game = await lockGame({ transaction, serverId: server.id, gameId: id });
    const isPrivate = game?.visibility === GAME_VISIBILITY.private;
    if (isPrivate && formColumns.scheduleMode !== SCHEDULE_MODE.fixed) {
      return { error: "비공개 구인은 일시 지정형만 열 수 있습니다.", field: "scheduleMode" };
    }
    const columns = isPrivate ? toPrivateColumns(formColumns) : formColumns;
    const roster = await listRosterStatuses({ transaction, serverId: server.id, gameId: id });
    const block = editBlockReason({
      game,
      userId: user.id,
      columns,
      rosterCount: roster.length,
      confirmedCount: roster.filter((status) => status === PARTICIPANT_STATUS.confirmed).length,
    });
    if (block || !game) return block ?? { error: EDIT_FORBIDDEN_MESSAGE };

    // 룰은 바꿀 수 없으므로 서플리먼트는 저장된 룰의 판본에서 고른다.
    const set = game.rulebookId ? ruleSetOf({ myRulebooks, rulebookId: game.rulebookId }) : null;
    const supplementCheck = checkSupplements({
      supplements: values.supplements,
      set,
      previous: game.supplements,
      enforced: isCertEnforced(myRulebooks.enforcementDate),
    });
    if (!supplementCheck.ok) return { error: supplementCheck.error, field: "supplements" };

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
        // 표기를 꺼 둔 서버에서는 선택이 보이지 않으므로 올릴 때 정한 값을 그대로 둔다.
        adultOnly: server.adultOnlyEnabled ? columns.adultOnly : game.adultOnly,
        requireRulebookCert: columns.requireRulebookCert && !!set && !set.free,
        supplements: supplementCheck.supplements,
        linkLabels,
        ...(clearsSession ? { confirmedAt: null } : {}),
        ...(timeChanged ? { notifiedAt: null } : {}),
        ...(reopensJudgement ? { minPlayersJudgedAt: null } : {}),
      },
    });
    if (!updated) return { error: EDIT_FORBIDDEN_MESSAGE };
    await syncGameSupplementRequests({
      transaction,
      ...owner,
      categoryId: set?.categoryId ?? null,
      edition: set?.edition ?? "",
      names: manualSupplementNames(supplementCheck.supplements),
    });

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
      thumbnailChanged: hasThumbnailChanged({ before, after: values }),
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
