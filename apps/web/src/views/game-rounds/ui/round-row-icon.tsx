import {
  CalendarDays,
  CircleCheck,
  CircleDashed,
  CirclePlay,
  Ellipsis,
  Loader,
  Users,
} from "lucide-react";

import { ROUND_ROW_KIND, type RoundRowKind } from "../model/round-row-kind";

const ICON = {
  [ROUND_ROW_KIND.finished]: CircleCheck,
  [ROUND_ROW_KIND.inProgress]: CirclePlay,
  [ROUND_ROW_KIND.scheduled]: CalendarDays,
  [ROUND_ROW_KIND.coordinating]: Users,
  [ROUND_ROW_KIND.unscheduled]: CircleDashed,
  [ROUND_ROW_KIND.later]: Ellipsis,
  [ROUND_ROW_KIND.cancelling]: Loader,
} as const;

const TONE = {
  [ROUND_ROW_KIND.finished]: "text-success-600",
  [ROUND_ROW_KIND.inProgress]: "text-primary-600",
  [ROUND_ROW_KIND.scheduled]: "text-gray-600",
  [ROUND_ROW_KIND.coordinating]: "text-gray-600",
  [ROUND_ROW_KIND.unscheduled]: "text-hint",
  [ROUND_ROW_KIND.later]: "text-hint",
  [ROUND_ROW_KIND.cancelling]: "text-hint",
} as const;

interface RoundRowIconProps {
  kind: RoundRowKind;
}

export function RoundRowIcon({ kind }: RoundRowIconProps) {
  const Icon = ICON[kind];
  return <Icon size={20} aria-hidden className={`flex-none ${TONE[kind]}`} />;
}
