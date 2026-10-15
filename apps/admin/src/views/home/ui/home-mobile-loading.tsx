import { HStack, Skeleton, Text, VStack } from "@roll-and-call/ui";
import { CalendarDays, FileText, User } from "lucide-react";

import { formatDayRange } from "@/shared/lib";
import { AdminHeader, LoadingRegion, Panel } from "@/shared/ui";

import { formatToday } from "../model/format-today";
import { MobilePendingTodoLoading } from "./mobile/mobile-pending-todo-loading";
import { WeekCardLoading } from "./week-card-loading";

const SIX_DAYS = 6 * 86_400_000;

// 날짜는 서버 값이 아니라 오늘 기준이라 스켈레톤 없이 바로 그린다.
export function HomeMobileLoading() {
  const now = new Date();
  return (
    <>
      <AdminHeader title="홈" />
      <LoadingRegion
        label="홈 화면을 불러오는 중입니다"
        className="flex-none gap-150 px-150 py-200 break-keep"
      >
        <Text typography="body4" foreground="hint">
          {formatToday(now)}
        </Text>
        <Panel title="처리 대기">
          <ul>
            <MobilePendingTodoLoading />
            <MobilePendingTodoLoading />
          </ul>
        </Panel>
        <VStack className="h-5 justify-center">
          <Skeleton width={220} height={12} />
        </VStack>
        <HStack align="baseline" gap="100" className="mt-100">
          <Text typography="subtitle1" render={<h2 />}>
            이번 주
          </Text>
          <Text typography="body4" foreground="hint">
            {formatDayRange(new Date(now.getTime() - SIX_DAYS), now)}
          </Text>
        </HStack>
        <WeekCardLoading label="새 구인" icon={FileText} />
        <WeekCardLoading label="진행된 세션" icon={CalendarDays} />
        <WeekCardLoading label="가입" icon={User} />
        <WeekCardLoading label="탈퇴" icon={User} />
      </LoadingRegion>
    </>
  );
}
