import { Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { isNull, sumBy } from "es-toolkit";

import type { AnalyticsData } from "@/shared/server";

import { AnalyticsSection } from "./analytics-section";
import { Delta } from "./delta";
import { GmTopCard } from "./gm-top-card";

export const TOP_COUNT = 3;
const TOP_COLORS = ["--rc-color-bg-primary", "--rc-color-heat-4", "--rc-color-heat-3"] as const;
export const ROW_CLASS =
  "h-[36px] items-center justify-between border-t border-(--rc-color-border-subtle)";

interface GmSectionProps {
  analytics: AnalyticsData;
}

export function GmSection({ analytics }: GmSectionProps) {
  const { gms, otherGms, previousTopShare } = analytics;
  const listedSessions = sumBy(gms, (gm) => gm.count);
  const totalSessions = listedSessions + otherGms.sessions;
  const top = gms.slice(0, TOP_COUNT);
  const rest = gms.slice(TOP_COUNT);
  const topSessions = sumBy(top, (gm) => gm.count);
  const topShare = totalSessions ? Math.round((topSessions / totalSessions) * 100) : 0;
  const otherAverage = otherGms.count ? (otherGms.sessions / otherGms.count).toFixed(1) : "0";
  return (
    <AnalyticsSection title="GM 분포" sub="진행된 세션 기준">
      <HStack
        align="center"
        justify="between"
        gap="200"
        className="rounded-400 bg-tinted-bg px-200 py-150"
      >
        <VStack gap="025">
          <Text typography="body4" weight="medium" foreground="primary">
            상위 {TOP_COUNT}명 집중도
          </Text>
          <HStack align="baseline" gap="100">
            <Text typography="heading2" numeric className="leading-[1.1]">
              {topShare}%
            </Text>
            {isNull(previousTopShare) ? null : (
              <Delta value={topShare - previousTopShare} unit="%p" />
            )}
          </HStack>
        </VStack>
        <Text typography="body4" foreground="muted" className="text-right">
          진행된 세션 {totalSessions}건 중
          <br />
          상위 {TOP_COUNT}명이 {topSessions}건을 진행했습니다
        </Text>
      </HStack>
      <HStack gap="025" className="mt-125 h-4 overflow-hidden rounded-100">
        {top.map((gm, index) => (
          <div
            key={gm.nickname}
            style={{ flex: gm.count, background: `var(${TOP_COLORS[index]})` }}
          />
        ))}
        <div
          style={{
            flex: Math.max(0, totalSessions - topSessions),
            background: "var(--rc-color-bg-secondary)",
          }}
        />
      </HStack>
      <Grid className="mt-150 grid-cols-3 gap-100">
        {top.map((gm, index) => (
          <GmTopCard
            key={gm.nickname}
            rank={index + 1}
            nickname={gm.nickname}
            count={gm.count}
            share={totalSessions ? Math.round((gm.count / totalSessions) * 100) : 0}
            colorVariable={TOP_COLORS[index]!}
          />
        ))}
      </Grid>
      <Grid className="mt-150 grid-cols-2 gap-x-400">
        {rest.map((gm, index) => (
          <HStack key={gm.nickname} className={ROW_CLASS}>
            <Text typography="body4" foreground="muted">
              {index + TOP_COUNT + 1}위 · {gm.nickname}
            </Text>
            <Text typography="body4" weight="bold" numeric>
              {gm.count}건
            </Text>
          </HStack>
        ))}
        {otherGms.count ? (
          <HStack className={ROW_CLASS}>
            <Text typography="body4" foreground="muted">
              그 외 {otherGms.count}명
            </Text>
            <Text typography="body4" foreground="hint">
              {otherGms.sessions}건 · 1인당 평균 {otherAverage}건
            </Text>
          </HStack>
        ) : null}
      </Grid>
    </AnalyticsSection>
  );
}
