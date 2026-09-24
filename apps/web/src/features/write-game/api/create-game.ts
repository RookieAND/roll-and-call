"use server";

import { eq, inArray } from "drizzle-orm";
import { uniq } from "es-toolkit";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { canPickRulebook, toMyRulebooks } from "@/entities/rulebook";
import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import {
  announceRecruitmentComplete,
  db,
  games,
  getCurrentUser,
  getRulebookRecords,
  notifyDirectConfirmed,
  notifyGameCreated,
  participants,
  profiles,
} from "@/shared/server";

import { gameFormSchema, INVALID_INPUT_MESSAGE, type GameFormValues } from "../model/game-form";
import { toGameColumns } from "../model/to-game-columns";

export async function createGame(input: GameFormValues): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  // re-validate server-side (never trust the client)
  const parsed = gameFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? INVALID_INPUT_MESSAGE };
  }

  const records = await getRulebookRecords(user.id);
  const rulebook = toMyRulebooks(records).rulebooks.find(
    (candidate) => candidate.id === parsed.data.rulebookId,
  );
  if (!rulebook) return { error: "룰북을 다시 선택해 주세요.", field: "rule" };
  if (!canPickRulebook(rulebook, records.enforcementDate)) {
    return { error: "이 룰북은 인증을 받아야 구인을 열 수 있습니다.", field: "rule" };
  }

  const invitedIds = uniq(parsed.data.preConfirmed.map((player) => player.userId));
  if (invitedIds.includes(user.id)) return { error: "GM은 참여자로 넣을 수 없습니다." };
  if (invitedIds.length > 0) {
    const found = await db.$count(profiles, inArray(profiles.id, invitedIds));
    if (found !== invitedIds.length) {
      return { error: "찾을 수 없는 사람이 있습니다. 직접 확정할 사람을 다시 골라 주세요." };
    }
  }

  // 구인글과 직접 확정한 사람을 한 트랜잭션에 넣어, 글만 올라가고 확정이 빠지는 일이 없게 한다.
  const gameId = await db.transaction(async (transaction) => {
    const [created] = await transaction
      .insert(games)
      .values({
        gmId: user.id,
        rule: rulebook.label,
        rulebookId: rulebook.id,
        ...toGameColumns(parsed.data),
      })
      .returning({ id: games.id });
    if (invitedIds.length > 0) {
      await transaction.insert(participants).values(
        invitedIds.map((userId) => ({
          gameId: created!.id,
          userId,
          status: PARTICIPANT_STATUS.confirmed,
        })),
      );
    }
    return created!.id;
  });

  const game = await db.query.games.findFirst({
    where: (table, { eq: equals }) => equals(table.id, gameId),
    with: { gm: { columns: { username: true } } },
  });
  const threadId =
    game && (await notifyGameCreated(game, game.gm?.username ?? "?", invitedIds.length));
  if (threadId) {
    await db.update(games).set({ discordThreadId: threadId }).where(eq(games.id, gameId));
    await notifyDirectConfirmed(gameId, invitedIds);
  }
  if (invitedIds.length === Number(parsed.data.maxPlayers)) {
    await announceRecruitmentComplete(gameId);
  }

  return { redirect: `/games/${gameId}` };
}
