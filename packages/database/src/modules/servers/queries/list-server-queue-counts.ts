import { and, count, countDistinct, eq, inArray, isNull } from "drizzle-orm";

import { db } from "../../../client";
import {
  certApplications,
  reports,
  reviewReports,
  rulebookRequests,
  serverMembers,
} from "../../../schema";

// 어드민 서버 선택 화면의 서버별 멤버 수와 처리 대기 건수. 서버 홈의 처리 대기와 같은 네 가지를 센다.
export async function listServerQueueCounts({ serverIds }: { serverIds: string[] }) {
  if (serverIds.length === 0) return new Map<string, ServerQueueCounts>();
  const byServer = <Row extends { serverId: string; value: number }>(rows: Row[]) =>
    new Map(rows.map((row) => [row.serverId, row.value]));
  const [members, certs, requests, reportedGames, reportedReviews] = await Promise.all([
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
    db
      .select({ serverId: reports.serverId, value: countDistinct(reports.gameId) })
      .from(reports)
      .where(and(inArray(reports.serverId, serverIds), isNull(reports.resolvedAt)))
      .groupBy(reports.serverId),
    db
      .select({ serverId: reviewReports.serverId, value: countDistinct(reviewReports.reviewId) })
      .from(reviewReports)
      .where(and(inArray(reviewReports.serverId, serverIds), isNull(reviewReports.outcome)))
      .groupBy(reviewReports.serverId),
  ]);
  const [memberMap, certMap, requestMap, gameMap, reviewMap] = [
    members,
    certs,
    requests,
    reportedGames,
    reportedReviews,
  ].map(byServer);
  return new Map(
    serverIds.map((serverId): [string, ServerQueueCounts] => {
      const certPending = certMap!.get(serverId) ?? 0;
      return [
        serverId,
        {
          members: memberMap!.get(serverId) ?? 0,
          certPending,
          pending:
            certPending +
            (requestMap!.get(serverId) ?? 0) +
            (gameMap!.get(serverId) ?? 0) +
            (reviewMap!.get(serverId) ?? 0),
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
