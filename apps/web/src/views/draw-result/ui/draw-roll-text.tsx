import { Text, type TextProps } from "@trpg/ui";

import { toRollGrade } from "../model/roll-grade";
import { GradedRoll } from "./graded-roll";
import { SlotNumber } from "./slot-number";

interface DrawRollTextProps {
  value: number;
  typography: TextProps["typography"];
  foreground: TextProps["foreground"];
}

export function DrawRollText({ value, typography, foreground }: DrawRollTextProps) {
  const grade = toRollGrade(value);
  if (grade) return <GradedRoll value={value} grade={grade} typography={typography} />;

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
