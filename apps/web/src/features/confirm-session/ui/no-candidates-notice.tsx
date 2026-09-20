import { EmptyState } from "@/shared/ui";

interface NoCandidatesNoticeProps {
  playLabel: string;
  respondentCount: number;
}

export function NoCandidatesNotice({ playLabel, respondentCount }: NoCandidatesNoticeProps) {
  return (
    <EmptyState
      size="section"
      image="/empty-states/empty-schedule.png"
      title={`${playLabel}이 연속으로 비는 시간이 없습니다`}
      description={`응답 ${respondentCount}명 기준으로 추천할 후보가 없습니다. 위 세션 시간 칸에서 직접 정하거나, 조율 기간을 늘려 보세요.`}
    />
  );
}
