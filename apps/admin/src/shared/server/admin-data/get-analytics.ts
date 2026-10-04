import "server-only";
import { buildAnalytics, type AnalyticsData } from "./build-analytics";
import { loadSnapshot } from "./snapshot";

interface GetAnalyticsOptions {
  previewEarly?: boolean;
  now?: Date;
}

export async function getAnalytics({
  previewEarly = false,
  now = new Date(),
}: GetAnalyticsOptions = {}): Promise<AnalyticsData> {
  const { sessions, noShows, users } = await loadSnapshot();
  return buildAnalytics({ sessions, noShows, users, previewEarly, now });
}
