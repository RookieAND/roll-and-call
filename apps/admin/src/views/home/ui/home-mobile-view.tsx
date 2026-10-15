import { HStack, Text, VStack } from "@roll-and-call/ui";
import { CalendarDays, FileText, User } from "lucide-react";

import type { WeeklySummary } from "@/entities/analytics/server";
import { formatDayRange } from "@/shared/lib";
import type { PendingItem } from "@/shared/server";
import { AdminHeader, EMPTY_IMAGE, EmptyState, Panel } from "@/shared/ui";

import { formatToday } from "../model/format-today";
import { MobilePendingTodo } from "./mobile/mobile-pending-todo";
import { MobileStaffChannelNote } from "./mobile/mobile-staff-channel-note";
import { MobileWeekCard } from "./mobile/mobile-week-card";

interface HomeMobileViewProps {
  today: Date;
  weekly: WeeklySummary;
  pendingItems: PendingItem[];
  staffChannel: boolean;
  owner: boolean;
}

// 모바일은 처리 대기를 맨 위에 두고, 주간 카드는 한 줄에 하나씩 쌓는다.
export function HomeMobileView({
  today,
  weekly,
  pendingItems,
  staffChannel,
  owner,
}: HomeMobileViewProps) {
  return (
    <>
      <AdminHeader title="홈" />
      <VStack gap="150" className="px-150 py-200 break-keep">
        <Text typography="body4" foreground="hint">
          {formatToday(today)}
        </Text>
        <Panel title="처리 대기">
          {pendingItems.length ? (
            <ul>
              {pendingItems.map((item) => (
                <MobilePendingTodo key={item.kind} item={item} />
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
        <MobileStaffChannelNote staffChannel={staffChannel} owner={owner} />
        <HStack align="baseline" gap="100" className="mt-100">
          <Text typography="subtitle1" render={<h2 />}>
            이번 주
          </Text>
          <Text typography="body4" foreground="hint">
            {formatDayRange(weekly.from, weekly.to)}
          </Text>
        </HStack>
        <MobileWeekCard label="새 구인" icon={FileText} unit="건" series={weekly.newPosts} />
        <MobileWeekCard
          label="진행된 세션"
          icon={CalendarDays}
          unit="건"
          series={weekly.finishedSessions}
        />
        <MobileWeekCard label="가입" icon={User} unit="명" series={weekly.signups} />
        <MobileWeekCard label="탈퇴" icon={User} unit="명" series={weekly.leaves} inverse />
      </VStack>
    </>
  );
}
