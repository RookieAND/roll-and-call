import { EmptyState } from "@/shared/ui";

export function ScheduleOverlapEmpty() {
  return (
    <EmptyState
      image="/empty-states/empty-schedule.png"
      size="section"
      title="아직 응답한 참여자가 없어요"
      description="참여자가 가능 시간을 입력하면 여기에 겹침이 표시됩니다."
    />
  );
}
