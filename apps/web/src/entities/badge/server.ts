import "server-only";
import { loadMemberBadgeSummaries } from "@roll-and-call/database/badges";

import { pickRepresentativeBadge } from "./model/pick-representative-badge";

interface LoadRepresentativeBadgesParams {
  serverId: string;
  userIds: string[];
  now: Date;
}

// 사람마다 대표 뱃지 1번 칸과 그 사람의 뱃지 기록 전체(상세 시트가 이달의 뱃지 달 목록에 쓴다).
export async function loadRepresentativeBadges({
  serverId,
  userIds,
  now,
}: LoadRepresentativeBadgesParams) {
  const summaries = await loadMemberBadgeSummaries({ serverId, userIds: [...new Set(userIds)] });
  return summaries.flatMap((summary) => {
    const badge = pickRepresentativeBadge({
      featuredKeys: summary.featuredBadges,
      records: summary.records,
      now,
    });
    return badge ? [{ userId: summary.userId, badge, records: summary.records }] : [];
  });
}
