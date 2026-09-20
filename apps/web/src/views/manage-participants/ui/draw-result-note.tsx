import { Card, Text } from "@trpg/ui";

export function DrawResultNote({
  drawnAtLabel,
  applicantCount,
}: {
  drawnAtLabel: string;
  applicantCount: number;
}) {
  return (
    <Card padding="none" className="rounded-500 px-3.5 py-3">
      <Text typography="body4" foreground="muted" render={<p />}>
        {drawnAtLabel}에 추첨했습니다. 결과는 신청자 {applicantCount}명 모두에게 갔습니다.
      </Text>
    </Card>
  );
}
