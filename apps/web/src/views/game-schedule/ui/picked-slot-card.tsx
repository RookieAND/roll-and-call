import { Card, HStack, Text } from "@trpg/ui";

import { formatDateTime } from "@/shared/lib";

import { SlotMemberChip } from "./slot-member-chip";

interface PickedSlotCardProps {
  slotIso: string;
  names: string[];
  gmName?: string;
}

// 터치에는 hover 툴팁이 없어서, 누른 칸의 명단을 격자 아래 카드로 보여준다.
export function PickedSlotCard({ slotIso, names, gmName }: PickedSlotCardProps) {
  return (
    <Card
      radius={500}
      background="none"
      padding="none"
      className="border-primary-200 bg-primary-50 px-175 py-150"
      aria-live="polite"
    >
      <HStack align="baseline" gap="100">
        <Text numeric typography="subtitle2" render={<span />}>
          {formatDateTime(slotIso)}
        </Text>
        <span className="flex-1" />
        <Text numeric typography="body4" weight="bold" foreground="primary" render={<span />}>
          {names.length}명
        </Text>
      </HStack>
      <HStack wrap gap="075" className="mt-125">
        {names.map((name) => (
          <SlotMemberChip key={name} name={name} isGm={name === gmName} />
        ))}
      </HStack>
    </Card>
  );
}
