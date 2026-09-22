import { HStack, Text, cn } from "@roll-and-call/ui";
import { Users } from "lucide-react";

import type { SessionCount } from "../model/session-card-model";

interface SessionCountChipProps {
  count: SessionCount;
  dim?: boolean;
}

export function SessionCountChip({ count, dim = false }: SessionCountChipProps) {
  return (
    <HStack
      align="center"
      gap="050"
      className={cn(
        "h-6 flex-none rounded-300 px-100",
        dim ? "bg-gray-50 text-hint" : "bg-gray-100 text-gray-700",
      )}
    >
      {count.icon !== false && (
        <Users size={12} strokeWidth={2.2} aria-hidden className="shrink-0" />
      )}
      <Text numeric tight weight="bold" typography="body4" foreground="inherit">
        {count.label ? `${count.label} ${count.value}` : count.value}
      </Text>
    </HStack>
  );
}
