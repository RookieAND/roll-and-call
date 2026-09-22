"use client";

import { VStack } from "@roll-and-call/ui";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { availabilityQuery, type ScheduleAvailability } from "@/entities/availability";
import { AvailabilityGrid } from "@/features/coordinate-session";
import type { DayColumn, TimeRow } from "@/shared/lib";

import { groupDaysByWeek } from "../model/group-days-by-week";
import { weekIndexOf } from "../model/week-index-of";
import { DeadlinePassedNotice } from "./deadline-passed-notice";
import { ParticipantsOnlyNotice } from "./participants-only-notice";
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
  involved: boolean;
  isGm: boolean;
  isSignedIn: boolean;
  capacity: number;
  gmName?: string;
  prefill: { keys: string[]; label: string } | null;
  deadlinePassed: boolean;
}

export function ScheduleBody({
  gameId,
  days,
  timeRows,
  initialAvailability,
  confirmedAt,
  involved,
  isGm,
  isSignedIn,
  capacity,
  gmName,
  prefill,
  deadlinePassed,
}: ScheduleBodyProps) {
  const { data } = useQuery({ ...availabilityQuery(gameId), initialData: initialAvailability });
  const { aggregate, blocked } = data;

  const weeks = groupDaysByWeek(days);
  const confirmedDate =
    confirmedAt?.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }) ?? null;
  const [weekIndex, setWeekIndex] = useState(() => weekIndexOf(weeks, confirmedDate));
  const weekDays = weeks[weekIndex] ?? days;
  const pager =
    weeks.length > 1 ? <WeekPager weeks={weeks} index={weekIndex} onChange={setWeekIndex} /> : null;

  const respondentCount = new Set(Object.values(aggregate.names).flat()).size;
  const hasResponses = respondentCount > 0;
  const overlapProps = { days: weekDays, timeRows, aggregate, confirmedAt, capacity, gmName };
  const overlap = hasResponses ? (
    <ScheduleOverlap
      hint={
        "색이 진할수록 그 시간에 가능한 사람이 많습니다.\n칸을 누르면 그 시간에 가능한 사람이 보입니다."
      }
      {...overlapProps}
    />
  ) : (
    <ScheduleOverlapEmpty />
  );

  if (confirmedAt) {
    return (
      <VStack gap="150">
        {pager}
        <ScheduleOverlap hint="확정 칸은 초록 테두리입니다. 입력은 잠깁니다." {...overlapProps} />
      </VStack>
    );
  }

  if (involved) {
    return (
      <VStack gap="250">
        {!isGm && deadlinePassed && <DeadlinePassedNotice />}
        <VStack gap="150">
          {pager}
          <ScheduleTabs
            respondentCount={respondentCount}
            mine={
              <AvailabilityGrid
                gameId={gameId}
                days={weekDays}
                timeRows={timeRows}
                savedMine={aggregate.mine}
                prefill={prefill}
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
      <ParticipantsOnlyNotice isSignedIn={isSignedIn} />
      <VStack gap="150">
        {pager}
        {overlap}
      </VStack>
    </VStack>
  );
}
