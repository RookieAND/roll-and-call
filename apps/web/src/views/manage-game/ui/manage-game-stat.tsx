import { Text, VStack } from "@trpg/ui";
import { cva } from "class-variance-authority";

import type { ManageStat } from "../model/manage-summary";

// 첫 칸(마감·일시)이 제일 길어서 넓게 잡는다.
const statCell = cva("min-w-0 px-150 py-125", {
  variants: { wide: { true: "flex-[1.6]", false: "flex-1" } },
});

interface ManageGameStatProps {
  stat: ManageStat;
  wide: boolean;
}

export function ManageGameStat({ stat, wide }: ManageGameStatProps) {
  const foreground = stat.danger ? "danger" : undefined;

  return (
    <VStack gap="025" className={statCell({ wide })}>
      <Text typography="body4" foreground={stat.danger ? "danger" : "hint"}>
        {stat.label}
      </Text>
      <Text numeric truncate typography="body3" weight="extrabold" foreground={foreground}>
        {stat.value}
      </Text>
    </VStack>
  );
}
