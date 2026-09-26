import { omit } from "es-toolkit";
import { z } from "zod";

import { PARTICIPANT_STATUS } from "@/entities/game";
import type { PreConfirmedPlayer } from "@/features/write-game";
import { db } from "@/shared/server";

// 다음 회차는 별개의 새 구인글이다. 이전 회차 내용과 대기자를 폼에 채워 줄 뿐, 이전 회차는 건드리지 않는다.
export async function loadPreviousRound(gameId: string, gmId: string) {
  if (!z.uuid().safeParse(gameId).success) return null;
  const game = await db.query.games.findFirst({
    where: (table, { and, eq }) => and(eq(table.id, gameId), eq(table.gmId, gmId)),
    with: {
      participants: {
        where: (table, { eq }) => eq(table.status, PARTICIPANT_STATUS.waiting),
        with: { user: { columns: { username: true, avatarUrl: true, bio: true } } },
      },
    },
  });
  if (!game) return null;

  // 추첨이면 추첨 순위, 선착순이면 신청 순서대로 정원까지 채운다.
  const preConfirmed: PreConfirmedPlayer[] = game.participants
    .toSorted(
      (left, right) =>
        (left.drawRank ?? Infinity) - (right.drawRank ?? Infinity) ||
        left.joinedAt.getTime() - right.joinedAt.getTime(),
    )
    .slice(0, game.maxPlayers)
    .map((participant) => ({
      userId: participant.userId,
      username: participant.user?.username ?? "익명",
      avatarUrl: participant.user?.avatarUrl ?? null,
      bio: participant.user?.bio ?? null,
    }));
  const template = {
    ...omit(game, ["participants", "endDate"]),
    confirmedAt: null,
    rangeStart: null,
    rangeEnd: null,
  };
  return { template, preConfirmed };
}
