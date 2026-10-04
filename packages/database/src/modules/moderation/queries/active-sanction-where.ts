import { and, eq, gt, isNull, or } from "drizzle-orm";

import { sanctions } from "#/schema";

// 해제되지 않았고 기한이 남았거나 무기한인 제재.
export function activeSanctionWhere({ serverId, now }: { serverId: string; now: Date }) {
  return and(
    eq(sanctions.serverId, serverId),
    isNull(sanctions.releasedAt),
    or(isNull(sanctions.until), gt(sanctions.until, now)),
  );
}
