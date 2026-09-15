"use server";

import { and, asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { AUTH_REQUIRED_MESSAGE, GAME_NOT_FOUND_RESULT, type ActionResult } from "@/shared/api";
import { db, getCurrentUser, participants } from "@/shared/server";

import type { SecondRoundInput } from "../model/second-round";
import { validateRoundRange } from "../model/validate-round-range";
import { openNextRound } from "./open-next-round";

export async function createSecondRound(
  gameId: string,
  input: SecondRoundInput,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const rangeError = validateRoundRange(input);
  if (rangeError) return { error: rangeError };

  const parent = await db.query.games.findFirst({
    where: (table, { eq: equals }) => equals(table.id, gameId),
  });
  if (!parent) return GAME_NOT_FOUND_RESULT;
  if (parent.gmId !== user.id) return { error: "권한이 없습니다." };
  if (parent.confirmedAt) {
    const confirmedDay = parent.confirmedAt.toISOString().slice(0, 10);
    if (input.rangeStart <= confirmedDay) {
      return { error: "1회차 확정 세션 이후 날짜만 고를 수 있습니다." };
    }
  }

  const carried = await db
    .select({ userId: participants.userId })
    .from(participants)
    .where(
      and(eq(participants.gameId, gameId), eq(participants.status, PARTICIPANT_STATUS.waiting)),
    )
    .orderBy(asc(participants.joinedAt));
  if (carried.length === 0) return { error: "승계할 대기자가 없습니다." };

  const roundId = await openNextRound(parent, carried, input);

  revalidatePath(`/games/${gameId}/participants`);
  revalidatePath(`/games/${gameId}`);
  revalidatePath("/games");
  return { redirect: `/games/${roundId}` };
}
