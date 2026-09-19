import { Text } from "@trpg/ui";

export function DrawResultNote({
  drawnAtLabel,
  applicantCount,
}: {
  drawnAtLabel: string;
  applicantCount: number;
}) {
  return (
    <Text typography="body3" foreground="muted" render={<p />}>
      {drawnAtLabel}에 추첨했습니다. 결과는 신청자 {applicantCount}명 모두에게 갔습니다.
    </Text>
  );
}
