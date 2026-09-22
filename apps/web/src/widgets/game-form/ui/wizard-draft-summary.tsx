import { Card, Text } from "@roll-and-call/ui";

interface WizardDraftSummaryProps {
  title: string;
  line: string;
}

// 등록 위저드에서 앞 단계에 적은 것을 다음 단계 위에 한 줄로 남긴다.
export function WizardDraftSummary({ title, line }: WizardDraftSummaryProps) {
  return (
    <Card.Root radius={500} background="subtle" padding="none" className="px-175 py-150">
      <Text truncate typography="subtitle1">
        {title}
      </Text>
      <Text truncate typography="body4" foreground="muted" className="mt-025">
        {line}
      </Text>
    </Card.Root>
  );
}
