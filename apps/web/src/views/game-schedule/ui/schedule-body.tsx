import { VStack } from "@trpg/ui";
import type { AvailabilityAggregate } from "@/entities/availability";
import { AvailabilityGrid } from "@/features/coordinate-session";
import type { DayColumn, TimeRow } from "@/shared/lib";
import { StatusNotice } from "@/shared/ui";
import { ScheduleOverlap } from "./schedule-overlap";
import { ScheduleOverlapEmpty } from "./schedule-overlap-empty";
import { ScheduleTabs } from "./schedule-tabs";

type Props = {
  gameId: string;
  days: DayColumn[];
  timeRows: TimeRow[];
  aggregate: AvailabilityAggregate;
  // 다른 확정 세션과 겹쳐 고를 수 없는 슬롯
  blocked: string[];
  confirmedAt: Date | null;
  // GM이거나 참여 중이면 내 가능 시간을 입력할 수 있다
  involved: boolean;
};

// 조율 화면 본문. 확정됨 / 참여자 / 열람자 세 상태를 이른 반환으로 가른다.
export function ScheduleBody({
  gameId,
  days,
  timeRows,
  aggregate,
  blocked,
  confirmedAt,
  involved,
}: Props) {
  const hasResponses = Object.keys(aggregate.counts).length > 0;
  const overlap = hasResponses ? (
    <ScheduleOverlap
      hint="색이 진할수록 많은 인원이 가능합니다. 칸을 누르면 이름이 보입니다."
      days={days}
      timeRows={timeRows}
      aggregate={aggregate}
      confirmedAt={confirmedAt}
    />
  ) : (
    <ScheduleOverlapEmpty />
  );

  if (confirmedAt) {
    return (
      <ScheduleOverlap
        hint="확정된 슬롯은 초록 테두리로 표시됩니다. 편집은 잠깁니다."
        days={days}
        timeRows={timeRows}
        aggregate={aggregate}
        confirmedAt={confirmedAt}
      />
    );
  }

  if (involved) {
    return (
      <ScheduleTabs
        mine={
          <AvailabilityGrid
            gameId={gameId}
            days={days}
            timeRows={timeRows}
            initialMine={aggregate.mine}
            blocked={blocked}
          />
        }
        overlap={overlap}
      />
    );
  }

  return (
    <VStack gap={3}>
      {overlap}
      <StatusNotice tone="muted">참여자만 가능 시간을 입력할 수 있습니다.</StatusNotice>
    </VStack>
  );
}
