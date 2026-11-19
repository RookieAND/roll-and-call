import { HStack } from "@roll-and-call/ui";
import { Ellipsis } from "lucide-react";

import { ROUND_ROW_KIND, type RoundRowKind } from "../model/round-row-kind";

const TONE = {
  [ROUND_ROW_KIND.finished]: "text-success-600",
  [ROUND_ROW_KIND.inProgress]: "text-primary-600",
  [ROUND_ROW_KIND.scheduled]: "text-gray-600",
  [ROUND_ROW_KIND.coordinating]: "text-primary-600",
  [ROUND_ROW_KIND.unscheduled]: "text-hint",
  [ROUND_ROW_KIND.later]: "text-hint",
  [ROUND_ROW_KIND.cancelling]: "text-hint",
} as const;

interface RoundNumberBadgeProps {
  kind: RoundRowKind;
  roundNo: number | null;
}

export function RoundNumberBadge({ kind, roundNo }: RoundNumberBadgeProps) {
  return (
    <HStack
      align="center"
      justify="center"
      className={`size-8 flex-none rounded-full bg-gray-100 text-body3 font-extrabold tabular-nums ${TONE[kind]}`}
    >
      {roundNo === null ? <Ellipsis size={16} aria-hidden /> : roundNo}
    </HStack>
  );
}
