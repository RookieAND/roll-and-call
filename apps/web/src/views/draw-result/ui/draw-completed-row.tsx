import { Card, HStack, Text } from "@trpg/ui";
import { Check } from "lucide-react";

interface DrawCompletedRowProps {
  drawnAtLabel: string;
}

export function DrawCompletedRow({ drawnAtLabel }: DrawCompletedRowProps) {
  return (
    <Card padding="none" background="none" className="rounded-500 px-175 py-150">
      <HStack align="center" gap="125">
        <Check aria-hidden size={15} strokeWidth={2.6} className="flex-none text-success-700" />
        <Text typography="body4" className="flex-1">
          추첨 완료
        </Text>
        <Text typography="subtitle2" weight="bold" numeric>
          {drawnAtLabel}
        </Text>
      </HStack>
    </Card>
  );
}
