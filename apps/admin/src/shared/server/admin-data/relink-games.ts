import "server-only";
import { sql } from "drizzle-orm";

import type { Executor } from "./record-audit";

// 트리거는 rule이 바뀔 때만 돌아서 룰북 이름·다른 이름이 바뀌면 여기서 다시 맞춘다.
export async function relinkGames(tx: Executor) {
  await tx.execute(sql`
    update public.games set rulebook_id = public.match_rulebook(rule)
    where rulebook_id is distinct from public.match_rulebook(rule)
  `);
}
