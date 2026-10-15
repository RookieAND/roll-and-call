import { db } from "#/client";
import { servers } from "#/schema";

import { syncMonthlyBadges } from "./sync-monthly-badges";

// 개인 뱃지는 출석·후기 이벤트가 바로 맞춘다. 크론은 달이 바뀌어야 붙는 이달의 GM·PL만 서버마다 맞춘다.
export async function syncAllMonthlyBadges(now: Date = new Date()) {
  for (const server of await db.select({ id: servers.id }).from(servers)) {
    await syncMonthlyBadges({ serverId: server.id, now });
  }
}
