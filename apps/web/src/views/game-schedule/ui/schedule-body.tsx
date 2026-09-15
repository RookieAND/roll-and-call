"use client";

import { useQuery } from "@tanstack/react-query";
import { VStack } from "@trpg/ui";
import { useState } from "react";

import { availabilityQuery, rankSlots, type ScheduleAvailability } from "@/entities/availability";
import { ConfirmSessionForm } from "@/features/confirm-session";
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

// 확정 후보는 상위 3개를 먼저 보이고 "후보 더 보기"로 이만큼까지 편다.
const CANDIDATE_LIMIT = 10;

type Props = {
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
  confirmedCount: number;
  respondedCount: number;
};

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
  confirmedCount,
  respondedCount,
}: Props) {
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
  const candidates = rankSlots({ counts: aggregate.counts, limit: CANDIDATE_LIMIT });
  const hasResponses = candidates.length > 0;
  const overlapProps = { days: weekDays, timeRows, aggregate, confirmedAt, capacity, gmName };
  const overlap = hasResponses ? (
    <ScheduleOverlap
      hint="색이 진할수록 많은 인원이 가능합니다. 칸을 누르면 그 시간에 가능한 사람이 보입니다."
      {...overlapProps}
    />
  ) : (
    <ScheduleOverlapEmpty />
  );

  if (confirmedAt) {
    return (
      <VStack gap={5}>
        <VStack gap={3}>
          {pager}
          <ScheduleOverlap hint="확정 칸은 초록 테두리입니다. 입력은 잠깁니다." {...overlapProps} />
        </VStack>
        {isGm && (
          <ConfirmSessionForm
            gameId={gameId}
            candidates={candidates}
            confirmedCount={confirmedCount}
            respondedCount={respondedCount}
            currentIso={new Date(confirmedAt).toISOString()}
          />
        )}
      </VStack>
    );
  }

  if (involved) {
    return (
      <VStack gap={5}>
        {!isGm && deadlinePassed && <DeadlinePassedNotice />}
        {isGm && (
          <ConfirmSessionForm
            gameId={gameId}
            candidates={candidates}
            confirmedCount={confirmedCount}
            respondedCount={respondedCount}
          />
        )}
        <VStack gap={3}>
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
    <VStack gap={4}>
      <ParticipantsOnlyNotice isSignedIn={isSignedIn} />
      <VStack gap={3}>
        {pager}
        {overlap}
      </VStack>
    </VStack>
  );
}
