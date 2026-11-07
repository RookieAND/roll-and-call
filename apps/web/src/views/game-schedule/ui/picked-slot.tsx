import { Text } from "@roll-and-call/ui";

import { PickedSlotCard } from "./picked-slot-card";

interface PickedSlotProps {
  picked: string | null;
  names: Record<string, string[]>;
  gmName?: string;
}

export function PickedSlot({ picked, names, gmName }: PickedSlotProps) {
  if (!picked)
    return (
      <Text typography="body4" foreground="hint" render={<p />}>
        칸을 누르면 그 시간에 가능한 사람이 보입니다.
      </Text>
    );
  return <PickedSlotCard slotIso={picked} names={names[picked] ?? []} gmName={gmName} />;
}
