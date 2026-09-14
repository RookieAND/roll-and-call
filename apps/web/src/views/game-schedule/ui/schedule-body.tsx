"use client";

import { VStack } from "@trpg/ui";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { availabilityQuery, rankSlots, type ScheduleAvailability } from "@/entities/availability";
import { ConfirmSessionForm } from "@/features/confirm-session";
import { AvailabilityGrid } from "@/features/coordinate-session";
import { formatDateTime, type DayColumn, type TimeRow } from "@/shared/lib";
import { StatusNotice } from "@/shared/ui";
import { groupDaysByWeek, weekIndexOf } from "../model/weeks";
import { ScheduleOverlap } from "./schedule-overlap";
import { ScheduleOverlapEmpty } from "./schedule-overlap-empty";
import { ScheduleTabs } from "./schedule-tabs";
import { WeekPager } from "./week-pager";

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
};

// 조율 화면 본문. 확정됨 / 참여자 / 열람자 세 상태를 이른 반환으로 가른다.
// 그리드·히트맵·확정 후보가 같은 쿼리를 읽어, 저장 직후 겹침과 후보가 함께 바뀐다.
export function ScheduleBody({
  gameId,
  days,
  timeRows,
  initialAvailability,
  confirmedAt,
  involved,
  isGm,
}: Props) {
  const { data } = useQuery({ ...availabilityQuery(gameId), initialData: initialAvailability });
  const { aggregate, blocked } = data;

  // 기간이 길면 열이 끝없이 늘어나서 주 단위로 한 화면씩 본다. 선택은 슬롯 ISO로 들고 있어 주를 넘겨도 유지된다.
  const weeks = groupDaysByWeek(days);
  const confirmedDate = confirmedAt?.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }) ?? null;
  const [weekIndex, setWeekIndex] = useState(() => weekIndexOf(weeks, confirmedDate));
  const weekDays = weeks[weekIndex] ?? days;
  const pager =
    weeks.length > 1 ? <WeekPager weeks={weeks} index={weekIndex} onChange={setWeekIndex} /> : null;

  const hasResponses = Object.keys(aggregate.counts).length > 0;
  const overlap = hasResponses ? (
    <ScheduleOverlap
      hint="색이 진할수록 많은 인원이 가능합니다. 칸을 누르면 이름이 보입니다."
      days={weekDays}
      timeRows={timeRows}
      aggregate={aggregate}
      confirmedAt={confirmedAt}
    />
  ) : (
    <ScheduleOverlapEmpty />
  );

  if (confirmedAt) {
    return (
      <VStack gap={3}>
        {pager}
        <ScheduleOverlap
          hint="확정된 슬롯은 초록 테두리로 표시됩니다. 편집은 잠깁니다."
          days={weekDays}
          timeRows={timeRows}
          aggregate={aggregate}
          confirmedAt={confirmedAt}
        />
      </VStack>
    );
  }

  if (involved) {
    const confirmOptions = rankSlots({ counts: aggregate.counts }).map(({ iso, count }) => ({
      iso,
      label: `${formatDateTime(iso)} · ${count}명 가능`,
    }));

    return (
      <VStack gap={6}>
        <VStack gap={3}>
          {pager}
          <ScheduleTabs
            mine={
              <AvailabilityGrid
                gameId={gameId}
                days={weekDays}
                timeRows={timeRows}
                initialMine={aggregate.mine}
                blocked={blocked}
              />
            }
            overlap={overlap}
          />
        </VStack>
        {isGm && <ConfirmSessionForm gameId={gameId} options={confirmOptions} />}
      </VStack>
    );
  }

  return (
    <VStack gap={3}>
      {pager}
      {overlap}
      <StatusNotice tone="muted">참여자만 가능 시간을 입력할 수 있습니다.</StatusNotice>
    </VStack>
  );
}
