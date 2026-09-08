"use server";

import { and, asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { PARTICIPANT_STATUS } from "@/entities/game";
import { availabilities, db, games, participants } from "@/shared/api/db";
import { createClient } from "@/shared/api/supabase/server";
import type { ActionResult } from "@/shared/api/action-result";

export type SecondRoundInput = { rangeStart: string; rangeEnd: string };

const { confirmed, waiting } = PARTICIPANT_STATUS;

// 대기자를 승계해 같은 게임의 다음 회차를 연다. 새 게임은 coordinate 모드로 열리고
// 대기자는 confirmed로 자동 초대되며, 입력해둔 가능 시간표도 함께 옮겨진다.
export async function createSecondRound(
  gameId: string,
  input: SecondRoundInput,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const { rangeStart, rangeEnd } = input;
  if (!rangeStart || !rangeEnd) return { error: "조율 기간을 입력하세요." };
  if (rangeEnd <= rangeStart) {
    return { error: "종료일은 시작일보다 이후여야 합니다." };
  }

  const parent = await db.query.games.findFirst({
    where: (g, { eq: eqOp }) => eqOp(g.id, gameId),
  });
  if (!parent) return { error: "존재하지 않는 게임입니다." };
  if (parent.gmId !== user.id) return { error: "권한이 없습니다." };
  if (parent.confirmedAt) {
    const confirmedDay = parent.confirmedAt.toISOString().slice(0, 10);
    if (rangeStart <= confirmedDay) {
      return { error: "1회차 확정 세션 이후 날짜만 고를 수 있습니다." };
    }
  }

  const carried = await db
    .select({ userId: participants.userId })
    .from(participants)
    .where(and(eq(participants.gameId, gameId), eq(participants.status, waiting)))
    .orderBy(asc(participants.joinedAt));
  if (carried.length === 0) return { error: "승계할 대기자가 없습니다." };

  const newId = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(games)
      .values({
        gmId: parent.gmId,
        title: parent.title,
        rule: parent.rule,
        synopsis: parent.synopsis,
        thumbnailUrl: parent.thumbnailUrl,
        playTime: parent.playTime,
        maxPlayers: parent.maxPlayers,
        scheduleMode: "coordinate",
        endDate: new Date(`${rangeEnd}T23:59:59`),
        rangeStart,
        rangeEnd,
        parentGameId: parent.id,
        round: parent.round + 1,
      })
      .returning({ id: games.id });
    const roundId = created!.id;

    // 대기 순서대로 정원까지 confirmed, 초과분은 다시 waiting으로 승계.
    await tx.insert(participants).values(
      carried.map((p, i) => ({
        gameId: roundId,
        userId: p.userId,
        status: i < parent.maxPlayers ? confirmed : waiting,
      })),
    );

    // ponytail: 이전 회차에 입력해둔 가능 시간표를 그대로 옮긴다. 새 조율 기간
    // 밖의 슬롯은 그리드에 안 뜰 뿐 해가 없다 — "조율 처음부터 안 함" 약속만 지킨다.
    const carriedIds = new Set(carried.map((p) => p.userId));
    const oldSlots = await db.query.availabilities.findMany({
      where: (a, { eq: eqOp }) => eqOp(a.gameId, gameId),
    });
    const toCopy = oldSlots
      .filter((s) => carriedIds.has(s.userId))
      .map((s) => ({ gameId: roundId, userId: s.userId, slotStart: s.slotStart }));
    if (toCopy.length > 0) {
      await tx.insert(availabilities).values(toCopy);
    }

    // 승계된 대기자는 이전 회차에서 제거한다(다음 회차로 이동).
    for (const p of carried) {
      await tx
        .delete(participants)
        .where(and(eq(participants.gameId, gameId), eq(participants.userId, p.userId)));
    }

    return roundId;
  });

  revalidatePath(`/games/${gameId}/participants`);
  revalidatePath(`/games/${gameId}`);
  revalidatePath("/games");
  return { redirect: `/games/${newId}` };
}
