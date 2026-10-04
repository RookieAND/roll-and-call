"use client";

import { VStack } from "@roll-and-call/ui";
import { useQuery } from "@tanstack/react-query";
import { uniq } from "es-toolkit";
import { useParams } from "next/navigation";
import { useState } from "react";

import { availabilityQuery, type ScheduleAvailability } from "@/entities/availability";
import { AvailabilityGrid } from "@/features/coordinate-session";
import type { DayColumn, TimeRow } from "@/shared/lib";

import { closedScheduleNotice } from "../model/closed-schedule-notice";
import { groupDaysByWeek } from "../model/group-days-by-week";
import { SCHEDULE_NOTICE } from "../model/schedule-notices";
import { SCHEDULE_TAB, type ScheduleTab } from "../model/schedule-tab";
import { weekIndexOf } from "../model/week-index-of";
import { ConfirmedSessionNotice } from "./confirmed-session-notice";
import { ParticipantsOnlyNotice } from "./participants-only-notice";
import { ScheduleNotice } from "./schedule-notice";
import { ScheduleOverlap } from "./schedule-overlap";
import { ScheduleOverlapEmpty } from "./schedule-overlap-empty";
import { ScheduleTabs } from "./schedule-tabs";
import { WeekPager } from "./week-pager";

interface ScheduleBodyProps {
  gameId: string;
  days: DayColumn[];
  timeRows: TimeRow[];
  // 서버 첫 렌더 값. 이후엔 쿼리 캐시(저장 후 invalidate, 포커스 복귀 시 refetch)가 갱신한다.
  initialAvailability: ScheduleAvailability;
  confirmedAt: Date | null;
  // GM 또는 확정 참여자. 대기자·추첨 전 신청자·내보낸 사람은 보기만 한다(R2).
  canPaint: boolean;
  awaitingDraw: boolean;
  // 모집 마감이 지났는데 확정 참여자가 없다.
  unscheduled: boolean;
  isGm: boolean;
  isSignedIn: boolean;
  capacity: number;
  gmName?: string;
  deadlinePassed: boolean;
}

export function ScheduleBody({
  gameId,
  days,
  timeRows,
  initialAvailability,
  confirmedAt,
  canPaint,
  awaitingDraw,
  unscheduled,
  isGm,
  isSignedIn,
  capacity,
  gmName,
  deadlinePassed,
}: ScheduleBodyProps) {
  const { server } = useParams<{ server: string }>();
  const { data } = useQuery({
    ...availabilityQuery({ slug: server, gameId }),
    initialData: initialAvailability,
  });
  const { aggregate, blocked } = data;

  const weeks = groupDaysByWeek(days);
  const confirmedDate =
    confirmedAt?.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }) ?? null;
  const [weekIndex, setWeekIndex] = useState(() => weekIndexOf({ weeks, date: confirmedDate }));
  const [tab, setTab] = useState<ScheduleTab>(
    confirmedAt ? SCHEDULE_TAB.overlap : SCHEDULE_TAB.mine,
  );
  const weekDays = weeks[weekIndex] ?? days;
  const pager = <WeekPager weeks={weeks} index={weekIndex} onChange={setWeekIndex} />;

  const respondentCount = uniq(Object.values(aggregate.names).flat()).length;
  const hasResponses = respondentCount > 0;
  const overlapProps = { days: weekDays, timeRows, aggregate, confirmedAt, capacity, gmName };
  const paintable = canPaint && !confirmedAt && !awaitingDraw && !unscheduled;
  const overlap = hasResponses ? (
    <ScheduleOverlap hint="색이 진할수록 그 시간에 가능한 사람이 많습니다." {...overlapProps} />
  ) : (
    <ScheduleOverlapEmpty onPaint={paintable ? () => setTab(SCHEDULE_TAB.mine) : undefined} />
  );

  const lockedTabs = (
    <ScheduleTabs
      value={SCHEDULE_TAB.overlap}
      onValueChange={setTab}
      respondentCount={respondentCount}
      mine={null}
      overlap={overlap}
      disabled
    />
  );

  if (confirmedAt) {
    return (
      <VStack gap="150">
        {pager}
        <ConfirmedSessionNotice confirmedAt={confirmedAt} />
        {lockedTabs}
      </VStack>
    );
  }

  const closedNotice = closedScheduleNotice({ awaitingDraw, unscheduled });
  if (closedNotice) {
    return (
      <VStack gap="150">
        <ScheduleNotice {...closedNotice} />
        {pager}
        {lockedTabs}
      </VStack>
    );
  }

  if (paintable) {
    return (
      <VStack gap="250">
        {!isGm && deadlinePassed && <ScheduleNotice {...SCHEDULE_NOTICE.deadlinePassed} />}
        <VStack gap="150">
          {pager}
          <ScheduleTabs
            value={tab}
            onValueChange={setTab}
            respondentCount={respondentCount}
            mine={
              <AvailabilityGrid
                gameId={gameId}
                days={weekDays}
                timeRows={timeRows}
                savedMine={aggregate.mine}
                blocked={blocked}
              />
            }
            overlap={overlap}
          />
        </VStack>
      </VStack>
    );
  }

  return (
    <VStack gap="200">
      <ParticipantsOnlyNotice gameId={gameId} isSignedIn={isSignedIn} />
      <VStack gap="150">
        {pager}
        {overlap}
      </VStack>
    </VStack>
  );
}
