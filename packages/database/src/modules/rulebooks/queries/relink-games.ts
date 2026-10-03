import { sql } from "drizzle-orm";

import type { Executor } from "#/modules/moderation/commands/record-audit";

// 트리거는 rule이 바뀔 때만 돌아서 룰북 이름·다른 이름이 바뀌면 여기서 다시 맞춘다.
// 룰북 목록은 서버마다 따로라 그 서버의 구인만 다시 맞춘다.
export async function relinkGames({
  executor,
  serverId,
}: {
  executor: Executor;
  serverId: string;
}) {
  await executor.execute(sql`
    update public.games set rulebook_id = public.match_rulebook(rule, server_id)
    where server_id = ${serverId}
      and rulebook_id is distinct from public.match_rulebook(rule, server_id)
  `);
}
