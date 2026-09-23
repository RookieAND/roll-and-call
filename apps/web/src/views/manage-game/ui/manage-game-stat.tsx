import { Text, VStack } from "@roll-and-call/ui";

import type { ManageStat } from "../model/manage-summary";

interface ManageGameStatProps {
  stat: ManageStat;
}

// 세 칸은 폭을 똑같이 나누고 가운데 맞춘다. 값은 줄바꿈 없이 한 줄로 둔다.
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
        className="whitespace-nowrap"
      >
        {stat.value}
      </Text>
    </VStack>
  );
}
