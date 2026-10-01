import { Card, Text } from "@roll-and-call/ui";

interface WizardDraftSummaryProps {
  title: string;
  line: string;
}

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
