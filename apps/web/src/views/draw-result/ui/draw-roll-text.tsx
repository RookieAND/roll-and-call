import { Text, type TextProps } from "@trpg/ui";

import { SlotNumber } from "./slot-number";

interface DrawRollTextProps {
  value: number;
  typography: TextProps["typography"];
  foreground: TextProps["foreground"];
}

export function DrawRollText({ value, typography, foreground }: DrawRollTextProps) {
  return (
    <Text
      numeric
      tight
      render={<p />}
      typography={typography}
      weight="extrabold"
      foreground={foreground}
      className="min-w-8 text-right tracking-tight"
    >
      <SlotNumber value={value} />
    </Text>
  );
}
