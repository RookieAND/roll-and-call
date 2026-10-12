import "server-only";

import { getMemberBadgeSummaries } from "@/shared/server";

import { pickRepresentativeTitle } from "./model/pick-representative-title";
import type { RepresentativeTitle } from "./model/representative-title";

interface LoadRepresentativeTitlesParams {
  serverId: string;
  userIds: string[];
  now: Date;
}

export async function loadRepresentativeTitles({
  serverId,
  userIds,
  now,
}: LoadRepresentativeTitlesParams): Promise<Record<string, RepresentativeTitle>> {
  const summaries = await getMemberBadgeSummaries({ serverId, userIds: [...new Set(userIds)] });
  const entries = summaries.flatMap((summary) => {
    const title = pickRepresentativeTitle({
      featuredKeys: summary.featuredBadges,
      showBadges: summary.showBadges,
      records: summary.records,
      now,
    });
    return title ? [[summary.userId, title] as const] : [];
  });
  return Object.fromEntries(entries);
}
