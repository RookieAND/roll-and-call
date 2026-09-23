import { Button } from "@roll-and-call/ui";

import { EmptyState } from "@/shared/ui";

interface ScheduleOverlapEmptyProps {
  // 칠할 수 있는 사람에게만 내 가능 시간 탭으로 가는 버튼을 준다.
  onPaint?: () => void;
}

export function ScheduleOverlapEmpty({ onPaint }: ScheduleOverlapEmptyProps) {
  return (
    <EmptyState
      image="/empty-states/empty-schedule.png"
      size="section"
      title="아직 가능 시간을 낸 사람이 없습니다"
      description={
        onPaint ? (
          <>
            참여자가 시간을 내면 여기에 겹쳐 보입니다.
            <br />
            먼저 내 가능 시간을 칠해 두세요.
          </>
        ) : (
          "참여자가 시간을 내면 여기에 겹쳐 보입니다."
        )
      }
      action={
        onPaint && (
          <Button onClick={onPaint} className="mt-100 w-full">
            내 가능 시간 칠하기
          </Button>
        )
      }
    />
  );
}
