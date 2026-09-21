import { db } from "@trpg/database";

import { notifyRecruitmentComplete } from "./notify-recruitment-complete";

// 정원이 막 찬 순간에 부른다. 신청·직접 확정·등록 때 확정 어느 길로 차든 같은 공지를 낸다.
export async function announceRecruitmentComplete(gameId: string) {
  const game = await db.query.games.findFirst({
    where: (table, { eq: equals }) => equals(table.id, gameId),
    with: {
      gm: { columns: { username: true } },
      participants: {
        where: (participant, { eq: equals }) => equals(participant.status, "confirmed"),
        orderBy: (participant, { asc }) => asc(participant.joinedAt),
        with: { user: { columns: { username: true, discordId: true } } },
      },
    },
  });
  if (!game) return;

  const players = game.participants.map((participant) => ({
    username: participant.user?.username ?? "?",
    discordId: participant.user?.discordId ?? null,
  }));
  await notifyRecruitmentComplete(game, game.gm?.username ?? "?", players);
}
