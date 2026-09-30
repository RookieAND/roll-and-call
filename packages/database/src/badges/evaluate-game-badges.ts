import { eq } from "drizzle-orm";

import { db } from "../client";
import { games, participants } from "../schema";
import { evaluateBadges } from "./evaluate-badges";

// 세션 하나의 기록이 바뀐 뒤(출석 확인·다시 고치기·불참 취소·구인 숨김·후기) 그 세션의 GM과 참여자를 다시 판정한다.
export async function evaluateGameBadges(gameId: string) {
  const [game] = await db.select({ gmId: games.gmId }).from(games).where(eq(games.id, gameId));
  if (!game) return;
  const members = await db
    .select({ userId: participants.userId })
    .from(participants)
    .where(eq(participants.gameId, gameId));
  await evaluateBadges([game.gmId, ...members.map((member) => member.userId)]);
}
