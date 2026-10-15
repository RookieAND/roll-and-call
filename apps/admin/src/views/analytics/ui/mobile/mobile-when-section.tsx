import { Callout, Text } from "@roll-and-call/ui";

import { ANALYTICS_EARLY_THRESHOLD, type AnalyticsData } from "@/entities/analytics";

import { finishedGridInsight } from "../../model/finished-grid-insight";
import { GRID_MODE, type GridMode } from "../../model/grid-mode";
import { openGridInsight } from "../../model/open-grid-insight";
import { MobileAnalyticsSection } from "./mobile-analytics-section";
import { MobileGridTabs } from "./mobile-grid-tabs";
import { MobileHeatGrid } from "./mobile-heat-grid";

interface MobileWhenSectionProps {
  analytics: AnalyticsData;
  mode: GridMode;
}

export function MobileWhenSection({ analytics, mode }: MobileWhenSectionProps) {
  const { early, grid } = analytics;
  const activeMode = early ? GRID_MODE.open : mode;
  const finishedCount = analytics.summary.finishedSessions.value ?? 0;
  const insight =
    activeMode === GRID_MODE.open ? openGridInsight(grid.open) : finishedGridInsight(grid.finished);
  return (
    <MobileAnalyticsSection
      title="언제 열리고 있나"
      sub={early ? "모집 중인 세션 기준" : undefined}
    >
      {early ? null : <MobileGridTabs mode={activeMode} />}
      {insight ? (
        <Text typography="body3" foreground="muted" className="leading-[1.6] [text-wrap:pretty]">
          {insight}
        </Text>
      ) : null}
      <MobileHeatGrid grid={grid[activeMode]} />
      {early ? (
        <Callout.Root colorPalette="gray">
          <Callout.Description>
            진행된 세션은 {ANALYTICS_EARLY_THRESHOLD}건 넘게 쌓이면 같은 격자에서 볼 수 있습니다.
            지금 {finishedCount}건입니다.
          </Callout.Description>
        </Callout.Root>
      ) : null}
    </MobileAnalyticsSection>
  );
}
