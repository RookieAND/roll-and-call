import { Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { CalendarDays, FileText } from "lucide-react";

import { formatDayRange } from "@/shared/lib";
import type { PendingItem, WeeklySummary } from "@/shared/server";
import { AdminHeader, EMPTY_IMAGE, EmptyState, Panel } from "@/shared/ui";

import { formatToday } from "../model/format-today";
import { shortDayRange } from "../model/short-day-range";
import { PendingRow } from "./pending-row";
import { StaffChannelHint } from "./staff-channel-hint";
import { WeekCard } from "./week-card";

interface HomeViewProps {
  weekly: WeeklySummary;
  pendingItems: PendingItem[];
  staffChannel: boolean;
  owner: boolean;
}

export function HomeView({ weekly, pendingItems, staffChannel, owner }: HomeViewProps) {
  const currentLabel = shortDayRange(weekly.from, weekly.to);
  return (
    <>
      <AdminHeader title="홈" sub={formatToday(weekly.to)} />
      <VStack gap="150" className="mx-auto w-full max-w-content p-200">
        <HStack align="baseline" gap="100">
          <Text typography="subtitle1" render={<h2 />}>
            최근 7일
          </Text>
          <Text typography="body4" foreground="hint">
            {formatDayRange(weekly.from, weekly.to)}
          </Text>
        </HStack>
        <Grid className="grid-cols-[repeat(2,minmax(0,1fr))] gap-125">
          <WeekCard
            label="새 구인"
            icon={FileText}
            unit="건"
            series={weekly.newPosts}
            currentLabel={currentLabel}
          />
          <WeekCard
            label="진행된 세션"
            icon={CalendarDays}
            unit="건"
            series={weekly.finishedSessions}
            currentLabel={currentLabel}
          />
        </Grid>
        <Panel
          title="처리 대기"
          right={<StaffChannelHint staffChannel={staffChannel} owner={owner} />}
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
                title="처리할 일이 없습니다"
                description="새 인증 신청이나 룰북 추가 요청이 들어오면 여기에 표시됩니다."
              />
            </div>
          )}
        </Panel>
      </VStack>
    </>
  );
}
