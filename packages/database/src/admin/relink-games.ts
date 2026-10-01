import { sql } from "drizzle-orm";

import type { Executor } from "./record-audit";

// 트리거는 rule이 바뀔 때만 돌아서 룰북 이름·다른 이름이 바뀌면 여기서 다시 맞춘다.
// 룰북 카탈로그는 모든 서버가 함께 쓰므로 서버를 가리지 않고 모든 구인을 다시 맞춘다.
export async function relinkGames(executor: Executor) {
  await executor.execute(sql`
    update public.games set rulebook_id = public.match_rulebook(rule)
    where rulebook_id is distinct from public.match_rulebook(rule)
  `);
}
