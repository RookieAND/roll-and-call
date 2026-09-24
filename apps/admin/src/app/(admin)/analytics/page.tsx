import type { Metadata } from "next";

import { getAnalytics } from "@/shared/server";
import { AnalyticsView, GRID_MODE } from "@/views/analytics";

export const metadata: Metadata = { title: "분석" };

export default async function AnalyticsPage({ searchParams }: PageProps<"/analytics">) {
  const { grid, early } = (await searchParams) as Record<string, string | undefined>;
  // ?early=1은 개발 중에 analytics_early 상태를 미리 보는 용도다.
  const previewEarly = process.env.NODE_ENV !== "production" && early === "1";
  const analytics = await getAnalytics({ previewEarly });
  return (
    <AnalyticsView
      analytics={analytics}
      gridMode={grid === GRID_MODE.open ? GRID_MODE.open : GRID_MODE.finished}
    />
  );
}
