import "server-only";
import { sql } from "drizzle-orm";

import type { Executor } from "./record-audit";

// 룰북 이름·다른 이름이 바뀌면 구인의 자유 입력 룰을 다시 맞춘다. 트리거는 rule이 바뀔 때만 돈다.
export async function relinkGames(tx: Executor) {
  await tx.execute(sql`
    update public.games set rulebook_id = public.match_rulebook(rule)
    where rulebook_id is distinct from public.match_rulebook(rule)
  `);
}
