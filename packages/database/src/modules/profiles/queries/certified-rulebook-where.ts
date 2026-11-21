import { and, eq, isNull } from "drizzle-orm";

import { homebrewUsableSql } from "#db/modules/homebrew/queries/homebrew-usable-sql";
import { certifications, rulebooks } from "#db/schema";

// 유저 목록의 "인증 룰북" 정의. 반려·사용자가 지운 기록, 숨긴 룰북, 쓸 수 없는 자작 룰은 뺀다. 부르는 쪽이 certifications와 rulebooks를 join한다.
export function certifiedRulebookWhere(serverId: string) {
  return and(
    eq(certifications.serverId, serverId),
    isNull(certifications.discardedAt),
    isNull(certifications.revokedAt),
    eq(rulebooks.serverId, serverId),
    eq(rulebooks.hidden, false),
    homebrewUsableSql({ rulebookId: rulebooks.id, userId: certifications.userId }),
  )!;
}
