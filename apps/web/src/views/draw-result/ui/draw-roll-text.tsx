import { Text } from "@trpg/ui";

import type { SlotSpin } from "../model/slot-spin";
import { SlotNumber } from "./slot-number";

interface DrawRollTextProps {
  value: number;
  emphasized: boolean;
  strong: boolean;
  spin?: SlotSpin;
}

export function DrawRollText({ value, emphasized, strong, spin }: DrawRollTextProps) {
  const typography = emphasized ? "heading2" : "subtitle1";
  const foreground = strong ? "normal" : "muted";

  return (
    <Text
      numeric
      typography={typography}
      weight="extrabold"
      foreground={foreground}
      className="min-w-8 text-right tracking-tight"
    >
      {spin ? <SlotNumber value={value} spin={spin} /> : value}
    </Text>
  );
}
