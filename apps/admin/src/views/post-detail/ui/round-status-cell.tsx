import { HStack, Text } from "@roll-and-call/ui";
import { CalendarCheck, CircleCheck, CircleDashed, Clock3, Hourglass, Play } from "lucide-react";

import { ROUND_STATUS, ROUND_STATUS_LABEL, type RoundStatus } from "../model/round-status";

const STATUS_ICON = {
  [ROUND_STATUS.none]: CircleDashed,
  [ROUND_STATUS.coordinating]: Clock3,
  [ROUND_STATUS.upcoming]: CalendarCheck,
  [ROUND_STATUS.live]: Play,
  [ROUND_STATUS.ended]: CircleCheck,
  [ROUND_STATUS.cancelling]: Hourglass,
} as const satisfies Record<RoundStatus, unknown>;

export function RoundStatusCell({ status }: { status: RoundStatus }) {
  const Icon = STATUS_ICON[status];
  return (
    <HStack align="center" gap="050" render={<span />}>
      <Icon aria-hidden size={14} />
      <Text typography="body3" render={<span />}>
        {ROUND_STATUS_LABEL[status]}
      </Text>
    </HStack>
  );
}
