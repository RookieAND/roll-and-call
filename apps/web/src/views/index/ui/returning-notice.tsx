import { HStack, Text } from "@roll-and-call/ui";
import { History } from "lucide-react";

import { RETURNING_HINT } from "@/shared/ui";

export function ReturningNotice() {
  return (
    <HStack align="center" justify="center" gap="075" className="text-gray-600">
      <History size={14} aria-hidden />
      <Text typography="body4" foreground="muted">
        {RETURNING_HINT}
      </Text>
    </HStack>
  );
}
