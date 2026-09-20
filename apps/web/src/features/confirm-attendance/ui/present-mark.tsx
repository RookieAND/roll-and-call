import { HStack, Text } from "@trpg/ui";
import { Check } from "lucide-react";

export function PresentMark() {
  return (
    <HStack gap="050" align="center">
      <Check size={14} strokeWidth={2.6} className="text-success-700" />
      <Text typography="subtitle1" foreground="success">
        참석
      </Text>
    </HStack>
  );
}
