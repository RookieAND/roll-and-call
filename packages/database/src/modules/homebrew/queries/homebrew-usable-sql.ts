import { sql, type SQL } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

import { homebrewRules } from "#db/schema";

// 자작 룰 사용 자격의 유일한 판정. 자작 룰이 아니거나, 보는 사람이 제작자이거나, 전체 사용이면 쓸 수 있다.
// 룰북 목록(getRulebookRecords)이 이 조건으로 거르므로 구인 등록·다시 열기·선택 시트가 모두 같은 판정을 쓴다.
export function homebrewUsableSql({
  rulebookId,
  userId,
}: {
  rulebookId: AnyPgColumn;
  userId: string | null;
}): SQL {
  return sql`not exists (select 1 from ${homebrewRules} where ${homebrewRules.rulebookId} = ${rulebookId}
    and ${homebrewRules.scope} <> 'everyone'
    and ${userId ? sql`${homebrewRules.makerId} is distinct from ${userId}` : sql`true`})`;
}
