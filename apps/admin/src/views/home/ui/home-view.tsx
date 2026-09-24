import { Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { CalendarDays, FileText } from "lucide-react";

import { formatDate, formatDayRange } from "@/shared/lib";
import type { PendingItem, WeeklySummary } from "@/shared/server";
import { AdminHeader, EMPTY_IMAGE, EmptyState, Panel } from "@/shared/ui";

import { PendingRow } from "./pending-row";
import { WeekCard } from "./week-card";

const weekday = new Intl.DateTimeFormat("ko-KR", { weekday: "short", timeZone: "Asia/Seoul" });

interface HomeViewProps {
  weekly: WeeklySummary;
  pendingItems: PendingItem[];
}

export function HomeView({ weekly, pendingItems }: HomeViewProps) {
  const today = `${formatDate(weekly.to)} (${weekday.format(weekly.to)})`;
  return (
    <>
      <AdminHeader title="홈" sub={today} />
      <VStack gap="150" className="mx-auto w-full max-w-content p-200">
        <HStack align="baseline" gap="100">
          <Text typography="subtitle1" render={<h2 />}>
            이번 주
          </Text>
          <Text typography="body4" foreground="hint">
            {formatDayRange(weekly.from, weekly.to)} · 그래프는 최근 8주
          </Text>
        </HStack>
        <Grid className="grid-cols-[repeat(2,minmax(0,1fr))] gap-125">
          <WeekCard label="새 구인" icon={FileText} unit="건" series={weekly.newPosts} />
          <WeekCard
            label="진행된 세션"
            icon={CalendarDays}
            unit="건"
            series={weekly.finishedSessions}
          />
        </Grid>
        <Panel
          title="처리 대기"
          right={
            <Text typography="body4" foreground="hint">
              오래 기다린 순
            </Text>
          }
        >
          {pendingItems.length ? (
            <ul>
              {pendingItems.map((item) => (
                <PendingRow key={item.kind} item={item} />
              ))}
            </ul>
          ) : (
            <div className="h-[260px]">
              <EmptyState
                image={EMPTY_IMAGE.hosted}
                title="처리할 일이 없어요"
                description="새 인증 신청, 룰북 추가 요청, 구인 신고가 들어오면 디스코드로 알림이 갑니다."
              />
            </div>
          )}
        </Panel>
      </VStack>
    </>
  );
}
