import { Text } from "@roll-and-call/ui";

import { DRAW_ROW_VARIANT, type DrawRowVariant } from "../model/draw-row-variant";
import { toRollGrade } from "../model/roll-grade";
import { GradedRoll } from "./graded-roll";
import { SlotNumber } from "./slot-number";

interface DrawRollTextProps {
  // 직접 확정해 추첨에 들어가지 않은 사람은 값이 없다.
  roll: number | null;
  variant: DrawRowVariant;
  isMe: boolean;
}

export function DrawRollText({ roll, variant, isMe }: DrawRollTextProps) {
  if (roll === null) {
    return (
      <Text typography="body4" foreground="hint">
        직접 확정
      </Text>
    );
  }

  const highlight = variant === DRAW_ROW_VARIANT.highlight;
  const large = highlight || (variant === DRAW_ROW_VARIANT.compact && isMe);
  const typography = large ? "heading2" : "heading3";

  const grade = toRollGrade(roll);
  if (grade) return <GradedRoll value={roll} grade={grade} typography={typography} />;

  return (
    <Text
      numeric
      tight
      render={<p />}
      typography={typography}
      weight="extrabold"
      foreground={highlight || isMe ? "normal" : "muted"}
      className="min-w-8 text-right tracking-tight"
    >
      <SlotNumber value={roll} />
    </Text>
  );
}
