import { Callout, HStack, Text, VStack } from "@roll-and-call/ui";

import { ANALYTICS_EARLY_THRESHOLD, type AnalyticsData } from "@/shared/server";

import { finishedGridInsight } from "../model/finished-grid-insight";
import { GRID_MODE, type GridMode } from "../model/grid-mode";
import { openGridInsight } from "../model/open-grid-insight";
import { AnalyticsSection } from "./analytics-section";
import { GridExplorer } from "./grid-explorer";
import { GridTabs } from "./grid-tabs";
import { RulebookSide } from "./rulebook-side";

interface WhenSectionProps {
  analytics: AnalyticsData;
  mode: GridMode;
}

// 초기에는 진행된 세션이 적어 모집 중 격자만 보여 준다.
export function WhenSection({ analytics, mode }: WhenSectionProps) {
  const { early, grid } = analytics;
  const activeMode = early ? GRID_MODE.open : mode;
  const finishedCount = analytics.summary.finishedSessions.value ?? 0;
  const insight =
    activeMode === GRID_MODE.open
      ? openGridInsight(grid.open, early)
      : finishedGridInsight(grid.finished);
  const caption =
    activeMode === GRID_MODE.open
      ? `지금 모집 중·일정 조율 중인 세션 ${analytics.openSessionCount}건 · 후보 시간이 여럿이면 모두 셉니다`
      : `지난 4주 동안 실제로 진행된 세션 ${finishedCount}건`;
  const rulebookTitle = activeMode === GRID_MODE.open ? "룰북별 모집 중" : "룰북별 진행된 세션";
  return (
    <AnalyticsSection
      title="언제 열리고 있나"
      right={
        early ? (
          <Text typography="body4" foreground="hint" className="whitespace-nowrap">
            모집 중인 세션 기준
          </Text>
        ) : (
          <GridTabs mode={activeMode} />
        )
      }
      insight={insight}
    >
      <HStack gap="300">
        <VStack className="min-w-0 flex-1">
          <GridExplorer grids={grid} mode={activeMode} caption={caption} interactive={!early} />
          {early ? (
            <Callout.Root colorPalette="gray" className="mt-150">
              <Callout.Description>
                진행된 세션은 {ANALYTICS_EARLY_THRESHOLD}건 넘게 쌓이면 같은 격자에서 볼 수
                있습니다. 지금 {finishedCount}건입니다.
              </Callout.Description>
            </Callout.Root>
          ) : null}
        </VStack>
        {early ? null : (
          <div className="w-[268px] shrink-0 border-l border-(--rc-color-border-subtle) pl-250">
            <RulebookSide
              title={rulebookTitle}
              rulebooks={analytics.rulebooks[activeMode]}
              firstComeShare={analytics.firstComeShare[activeMode]}
            />
          </div>
        )}
      </HStack>
    </AnalyticsSection>
  );
}
