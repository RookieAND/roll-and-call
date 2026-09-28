import { Card, Text } from "@roll-and-call/ui";

interface ReviewEmptyProps {
  text: string;
}

export function ReviewEmpty({ text }: ReviewEmptyProps) {
  return (
    <Card.Root background="subtle" padding="lg" radius={500} className="text-center">
      <Text typography="subtitle2" foreground="muted">
        {text}
      </Text>
    </Card.Root>
  );
}
