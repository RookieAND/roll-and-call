import { Badge, Card, HStack, Text } from "@trpg/ui";
import { Check } from "lucide-react";

interface DrawnRowProps {
  drawnAtLabel: string;
}

export function DrawnRow({ drawnAtLabel }: DrawnRowProps) {
  return (
    <Card padding="none" className="rounded-500 px-175 py-150">
      <HStack align="center" gap="100">
        <Check size={15} strokeWidth={2.6} aria-hidden className="shrink-0 text-success-600" />
        <Text typography="body4" foreground="muted" className="min-w-0 flex-1">
          추첨
        </Text>
        <Text numeric typography="subtitle2" className="shrink-0">
          {drawnAtLabel}
        </Text>
        <Badge className="shrink-0">완료</Badge>
      </HStack>
    </Card>
  );
}
