import { Card, Text } from "@trpg/ui";

interface DrawResultNoteProps {
  drawnAtLabel: string;
  applicantCount: number;
}

export function DrawResultNote({ drawnAtLabel, applicantCount }: DrawResultNoteProps) {
  return (
    <Card padding="none" className="rounded-500 px-175 py-150">
      <Text typography="body4" foreground="muted" render={<p />}>
        {drawnAtLabel}에 추첨했습니다. 결과는 신청자 {applicantCount}명 모두에게 갔습니다.
      </Text>
    </Card>
  );
}
