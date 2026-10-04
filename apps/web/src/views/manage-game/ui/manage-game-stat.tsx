import { Text, VStack } from "@roll-and-call/ui";

import type { ManageStat } from "../model/manage-summary";

interface ManageGameStatProps {
  stat: ManageStat;
}

export function ManageGameStat({ stat }: ManageGameStatProps) {
  return (
    <VStack gap="025" align="center" className="min-w-0 flex-1 text-center">
      <Text typography="body4" foreground={stat.danger ? "danger" : "hint"}>
        {stat.label}
      </Text>
      <Text
        numeric
        typography="body3"
        weight="extrabold"
        foreground={stat.danger ? "danger" : "normal"}
        className={stat.wrap ? "break-keep" : "whitespace-nowrap"}
      >
        {stat.value}
      </Text>
    </VStack>
  );
}
