import { Text } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";

import { toRollGrade } from "../model/roll-grade";
import { GradedRoll } from "./graded-roll";
import { SlotNumber } from "./slot-number";

interface DrawRollTextProps {
  // 직접 확정해 추첨에 들어가지 않은 사람은 값이 없다.
  roll: number | null;
  isMe: boolean;
}

export function DrawRollText({ roll, isMe }: DrawRollTextProps) {
  if (isNull(roll)) {
    return (
      <Text typography="body4" foreground="hint">
        직접 확정
      </Text>
    );
  }

  const typography = isMe ? "heading2" : "heading3";
  const grade = toRollGrade(roll);
  if (grade) return <GradedRoll value={roll} grade={grade} typography={typography} />;

  const foreground = isMe ? "normal" : "muted";
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
      <SlotNumber value={roll} />
    </Text>
  );
}
