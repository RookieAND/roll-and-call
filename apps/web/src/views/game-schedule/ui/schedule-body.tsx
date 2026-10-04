"use client";

import { VStack } from "@roll-and-call/ui";
import { useQuery } from "@tanstack/react-query";
import { isNull, uniq } from "es-toolkit";
import { useParams } from "next/navigation";
import { useState } from "react";

import { availabilityQuery, type ScheduleAvailability } from "@/entities/availability";
import { AvailabilityGrid } from "@/features/coordinate-session";
import { toKstDateInput, type DayColumn, type TimeRow } from "@/shared/lib";

import { groupDaysByWeek } from "../model/group-days-by-week";
import { SCHEDULE_BODY_MODE, type ScheduleBodyMode } from "../model/schedule-body-mode";
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
  mode: ScheduleBodyMode;
  capacity: number;
  gmName?: string;
}

export function ScheduleBody({
  gameId,
  days,
  timeRows,
  initialAvailability,
  mode,
  capacity,
  gmName,
}: ScheduleBodyProps) {
  const { server } = useParams<{ server: string }>();
  const { data } = useQuery({
    ...availabilityQuery({ slug: server, gameId }),
    initialData: initialAvailability,
  });
  const { aggregate, blocked } = data;

  const confirmedAt = mode.kind === SCHEDULE_BODY_MODE.confirmed ? mode.confirmedAt : null;
  const weeks = groupDaysByWeek(days);
  const confirmedDate = isNull(confirmedAt) ? null : toKstDateInput(confirmedAt);
  const [weekIndex, setWeekIndex] = useState(() => weekIndexOf({ weeks, date: confirmedDate }));
  const [tab, setTab] = useState<ScheduleTab>(
    confirmedAt ? SCHEDULE_TAB.overlap : SCHEDULE_TAB.mine,
  );
  const weekDays = weeks[weekIndex] ?? days;
  const pager = <WeekPager weeks={weeks} index={weekIndex} onChange={setWeekIndex} />;

  const respondentCount = uniq(Object.values(aggregate.names).flat()).length;
  const hasResponses = respondentCount > 0;
  const overlapProps = { days: weekDays, timeRows, aggregate, confirmedAt, capacity, gmName };
  const paintable = mode.kind === SCHEDULE_BODY_MODE.paint;
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

  switch (mode.kind) {
    case SCHEDULE_BODY_MODE.confirmed:
      return (
        <VStack gap="150">
          {pager}
          <ConfirmedSessionNotice confirmedAt={mode.confirmedAt} />
          {lockedTabs}
        </VStack>
      );
    case SCHEDULE_BODY_MODE.closed:
      return (
        <VStack gap="150">
          <ScheduleNotice {...mode.notice} />
          {pager}
          {lockedTabs}
        </VStack>
      );
    case SCHEDULE_BODY_MODE.paint:
      return (
        <VStack gap="250">
          {mode.showDeadlineNotice && <ScheduleNotice {...SCHEDULE_NOTICE.deadlinePassed} />}
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
    case SCHEDULE_BODY_MODE.viewOnly:
      return (
        <VStack gap="200">
          <ParticipantsOnlyNotice gameId={gameId} isSignedIn={mode.isSignedIn} />
          <VStack gap="150">
            {pager}
            {overlap}
          </VStack>
        </VStack>
      );
  }
}
