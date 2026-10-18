import "server-only";
import { loadAdminData } from "@/shared/server";

import { buildAnalytics, type AnalyticsData } from "../model/build-analytics";

interface GetAnalyticsOptions {
  previewEarly?: boolean;
  now?: Date;
}

export async function getAnalytics({
  previewEarly = false,
  now = new Date(),
}: GetAnalyticsOptions = {}): Promise<AnalyticsData> {
  const { sessions, noShows, users } = await loadAdminData(["sessions", "noShows", "users"]);
  return buildAnalytics({ sessions, noShows, users, previewEarly, now });
}
