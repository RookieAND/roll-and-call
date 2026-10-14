import { sql } from "drizzle-orm";

import type { Executor } from "#/modules/moderation/commands/record-audit";

// 구인 서플리먼트는 고른 때의 이름을 함께 저장한다. 룰북 이름이 바뀌면 그 룰북을 고른 구인의 이름도 같이 바꾼다.
// 디스코드 모집 글은 다음 수정 때 새 이름으로 바뀐다.
export async function renameGameSupplements({
  executor,
  serverId,
  rulebookId,
  name,
}: {
  executor: Executor;
  serverId: string;
  rulebookId: string;
  name: string;
}) {
  await executor.execute(sql`
    update public.games
    set supplements = (
      select jsonb_agg(
        case when item->>'rulebookId' = ${rulebookId}
          then jsonb_set(item, '{name}', to_jsonb(${name}::text))
          else item
        end
        order by position
      )
      from jsonb_array_elements(supplements) with ordinality as list(item, position)
    )
    where server_id = ${serverId}
      and supplements @> jsonb_build_array(jsonb_build_object('rulebookId', ${rulebookId}::text))
  `);
}
