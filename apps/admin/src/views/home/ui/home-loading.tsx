import { Grid, HStack, Skeleton, Text } from "@roll-and-call/ui";
import { CalendarDays, FileText } from "lucide-react";

import { AdminHeader, LoadingRegion, Panel } from "@/shared/ui";

import { PendingRowLoading } from "./pending-row-loading";
import { WeekCardLoading } from "./week-card-loading";

export function HomeLoading() {
  return (
    <>
      <AdminHeader title="홈" sub={<Skeleton width={80} height={12} render={<span />} />} />
      <LoadingRegion
        label="홈 화면을 불러오는 중입니다"
        className="mx-auto w-full max-w-content flex-none gap-150 p-200"
      >
        <HStack align="baseline" gap="100">
          <Text typography="subtitle1" render={<h2 />}>
            이번 주
          </Text>
          <Skeleton width={88} height={12} />
        </HStack>
        <Grid className="grid-cols-[repeat(2,minmax(0,1fr))] gap-125">
          <WeekCardLoading label="새 구인" icon={FileText} />
          <WeekCardLoading label="진행된 세션" icon={CalendarDays} />
        </Grid>
        <Panel title="처리 대기">
          <ul>
            <PendingRowLoading />
            <PendingRowLoading />
            <PendingRowLoading />
          </ul>
        </Panel>
      </LoadingRegion>
    </>
  );
}
