import { Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { CalendarDays, FileText } from "lucide-react";

import { formatDayRange } from "@/shared/lib";
import type { PendingItem, WeeklySummary } from "@/shared/server";
import { AdminHeader, EMPTY_IMAGE, EmptyState, Panel } from "@/shared/ui";

import { formatToday } from "../model/format-today";
import { PendingRow } from "./pending-row";
import { WeekCard } from "./week-card";

interface HomeViewProps {
  weekly: WeeklySummary;
  pendingItems: PendingItem[];
}

export function HomeView({ weekly, pendingItems }: HomeViewProps) {
  return (
    <>
      <AdminHeader title="홈" sub={formatToday(weekly.to)} />
      <VStack gap="150" className="mx-auto w-full max-w-content p-200">
        <HStack align="baseline" gap="100">
          <Text typography="subtitle1" render={<h2 />}>
            이번 주
          </Text>
          <Text typography="body4" foreground="hint">
            {formatDayRange(weekly.from, weekly.to)}
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
        <Panel title="처리 대기">
          {pendingItems.length ? (
            <ul>
              {pendingItems.map((item) => (
                <PendingRow key={item.kind} item={item} />
              ))}
            </ul>
          ) : (
            <div className="h-[260px]">
              <EmptyState image={EMPTY_IMAGE.hosted} title="처리할 일이 없어요" />
            </div>
          )}
        </Panel>
      </VStack>
    </>
  );
}
