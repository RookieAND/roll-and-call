"use client";

import { Text, VStack } from "@trpg/ui";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { availabilityQuery, rankSlots, type ScheduleAvailability } from "@/entities/availability";
import { LoginButton } from "@/features/auth";
import { ConfirmSessionForm } from "@/features/confirm-session";
import { AvailabilityGrid } from "@/features/coordinate-session";import type { DayColumn, TimeRow } from "@/shared/lib";
import { StatusNotice } from "@/shared/ui";
import { groupDaysByWeek, weekIndexOf } from "../model/weeks";
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
  // GM이거나 참여 중이면 내 가능 시간을 입력할 수 있다
  involved: boolean;
  isGm: boolean;
  isSignedIn: boolean;
  capacity: number;
  gmName?: string;
  // 프로필 기본 가능 시간대를 격자 칸으로 편 값(저장 전 상태로 미리 칠함)
  prefill: { keys: string[]; label: string } | null;
  deadlinePassed: boolean;
  confirmedCount: number;
  respondedCount: number;
};

// 조율 화면 본문. 확정됨 / 참여자 / 열람자 세 상태를 이른 반환으로 가른다.
// 격자·히트맵·확정 후보가 같은 쿼리를 읽어, 저장 직후 겹침과 후보가 함께 바뀐다.
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

  // 7일을 한 단위로 한 화면씩 본다. 선택은 슬롯 ISO로 들고 있어 주를 넘겨도 유지된다.
  const weeks = groupDaysByWeek(days);
  const confirmedDate = confirmedAt?.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }) ?? null;
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
        {!isGm && deadlinePassed && (
          <StatusNotice tone="muted" className="text-left">
            <Text typography="subtitle2" render={<p />}>
              모집 기한이 지났습니다
            </Text>
            <Text typography="body4" foreground="muted" render={<p />} className="mt-0.5">
              GM이 세션 시간을 확정하는 중입니다. 가능 시간은 지금도 고칠 수 있습니다.
            </Text>
          </StatusNotice>
        )}
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
      <StatusNotice tone="muted">
        <Text typography="subtitle2" render={<p />}>
          참여자만 가능 시간을 입력할 수 있습니다
        </Text>
        <Text typography="body4" foreground="muted" render={<p />} className="mt-0.5">
          겹침은 누구나 볼 수 있습니다.
        </Text>
        {!isSignedIn && <LoginButton className="mt-3 h-11 w-full" />}
      </StatusNotice>
      <VStack gap={3}>
        {pager}
        {overlap}
      </VStack>
    </VStack>
  );
}
