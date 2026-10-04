import { and, count, eq, inArray, isNull } from "drizzle-orm";

import { db } from "#/client";
import { certApplications, rulebookRequests, serverMembers } from "#/schema";

// 어드민 서버 선택 화면의 서버별 멤버 수와 처리 대기 건수. 처리 대기 2종(인증 신청 + 룰북 추가 요청)을 센다.
export async function listServerQueueCounts({ serverIds }: { serverIds: string[] }) {
  if (serverIds.length === 0) return new Map<string, ServerQueueCounts>();
  const byServer = <Row extends { serverId: string; value: number }>(rows: Row[]) =>
    new Map(rows.map((row) => [row.serverId, row.value]));
  const [members, certs, requests] = await Promise.all([
    db
      .select({ serverId: serverMembers.serverId, value: count() })
      .from(serverMembers)
      .where(and(inArray(serverMembers.serverId, serverIds), isNull(serverMembers.deletedAt)))
      .groupBy(serverMembers.serverId),
    db
      .select({ serverId: certApplications.serverId, value: count() })
      .from(certApplications)
      .where(
        and(inArray(certApplications.serverId, serverIds), eq(certApplications.status, "pending")),
      )
      .groupBy(certApplications.serverId),
    db
      .select({ serverId: rulebookRequests.serverId, value: count() })
      .from(rulebookRequests)
      .where(and(inArray(rulebookRequests.serverId, serverIds), isNull(rulebookRequests.outcome)))
      .groupBy(rulebookRequests.serverId),
  ]);
  const [memberMap, certMap, requestMap] = [members, certs, requests].map(byServer);
  return new Map(
    serverIds.map((serverId): [string, ServerQueueCounts] => {
      const certPending = certMap!.get(serverId) ?? 0;
      return [
        serverId,
        {
          members: memberMap!.get(serverId) ?? 0,
          certPending,
          pending: certPending + (requestMap!.get(serverId) ?? 0),
        },
      ];
    }),
  );
}

export interface ServerQueueCounts {
  members: number;
  certPending: number;
  pending: number;
}
