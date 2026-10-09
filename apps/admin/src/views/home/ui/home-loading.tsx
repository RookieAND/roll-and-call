import { Grid, HStack, Text } from "@roll-and-call/ui";
import { CalendarDays, FileText, User } from "lucide-react";

import { formatDayRange } from "@/shared/lib";
import { AdminHeader, LoadingRegion, Panel } from "@/shared/ui";

import { PendingRowLoading } from "./pending-row-loading";
import { WeekCardLoading } from "./week-card-loading";

const SIX_DAYS = 6 * 86_400_000;

// 날짜는 서버 값이 아니라 오늘 기준이라 스켈레톤 없이 바로 그린다.
export function HomeLoading() {
  const now = new Date();
  return (
    <>
      <AdminHeader title="홈" />
      <LoadingRegion
        label="홈 화면을 불러오는 중입니다"
        className="mx-auto w-full max-w-content flex-none gap-150 p-200"
      >
        <HStack align="baseline" gap="100">
          <Text typography="subtitle1" render={<h2 />}>
            이번 주
          </Text>
          <Text typography="body4" foreground="hint">
            {formatDayRange(new Date(now.getTime() - SIX_DAYS), now)}
          </Text>
        </HStack>
        <Grid className="grid-cols-[repeat(2,minmax(0,1fr))] gap-125">
          <WeekCardLoading label="새 구인" icon={FileText} />
          <WeekCardLoading label="진행된 세션" icon={CalendarDays} />
          <WeekCardLoading label="가입" icon={User} />
          <WeekCardLoading label="탈퇴" icon={User} />
        </Grid>
        <Panel title="처리 대기">
          <ul>
            <PendingRowLoading />
            <PendingRowLoading />
          </ul>
        </Panel>
      </LoadingRegion>
    </>
  );
}
