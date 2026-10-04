"use server";

import { listRosterStatuses, lockGame, updateOwnedGame } from "@roll-and-call/database/games";
import { withTransaction } from "@roll-and-call/database/transaction";
import { isNull } from "es-toolkit";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { PARTICIPANT_STATUS, SCHEDULE_MODE } from "@/entities/game";
import { type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import {
  getActingMember,
  refreshRecruitPost,
  removeUnusedGameFiles,
  notMemberError,
} from "@/shared/server";

import { EDIT_FORBIDDEN_MESSAGE, editBlockReason } from "../model/edit-block-reason";
import { gameFormSchema, INVALID_INPUT_MESSAGE, type GameFormValues } from "../model/game-form";
import { toGameColumns } from "../model/to-game-columns";

export async function updateGame(id: string, input: GameFormValues): Promise<ActionResult> {
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  const parsed = gameFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? INVALID_INPUT_MESSAGE };
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
    const updated = await updateOwnedGame({
      transaction,
      ...owner,
      columns: clearsSession ? { ...columns, confirmedAt: null } : columns,
    });
    if (!updated) return { error: EDIT_FORBIDDEN_MESSAGE };
    return { before: game };
  });
  if ("error" in result) return result;
  const { before } = result;

  after(() => refreshRecruitPost({ server, gameId: id }));

  const kept = new Set<string>([values.thumbnailUrl ?? "", ...values.images]);
  await removeUnusedGameFiles({
    serverId: server.id,
    urls: [before.thumbnailUrl, ...before.images].filter((url) => !isNull(url) && !kept.has(url)),
  });

  redirect(serverPath({ slug: server.slug, path: `/games/${id}` }));
}
