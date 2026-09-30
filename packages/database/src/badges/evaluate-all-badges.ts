import { db } from "../client";
import { profiles } from "../schema";
import { evaluateBadges } from "./evaluate-badges";

// ponytail: 전체 사용자를 차례로 다시 계산한다. 사용자가 수천 명을 넘어 크론이 느려지면 최근 기록이 바뀐 사람만 고른다.
export async function evaluateAllBadges(now: Date = new Date()) {
  const users = await db.select({ id: profiles.id }).from(profiles);
  await evaluateBadges(
    users.map((user) => user.id),
    now,
  );
}
