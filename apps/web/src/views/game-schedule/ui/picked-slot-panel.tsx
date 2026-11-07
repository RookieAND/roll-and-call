import { Card, Text, VStack } from "@roll-and-call/ui";

import { HeatLegend } from "./heat-legend";
import { PickedSlot } from "./picked-slot";

interface PickedSlotPanelProps {
  picked: string | null;
  names: Record<string, string[]>;
  capacity: number;
  gmName?: string;
  interactive: boolean;
}

// 1100px 이상 「겹치는 시간」 탭 오른쪽 패널. 모바일에서 격자 아래에 있던 범례와 고른 칸을 옮겨 온다.
export function PickedSlotPanel({
  picked,
  names,
  capacity,
  gmName,
  interactive,
}: PickedSlotPanelProps) {
  return (
    <Card.Root background="subtle" render={<section />}>
      <VStack gap="150">
        <Text typography="subtitle1" render={<h2 />}>
          고른 시간
        </Text>
        <HeatLegend capacity={capacity} className="gap-050" />
        {interactive && <PickedSlot picked={picked} names={names} gmName={gmName} />}
      </VStack>
    </Card.Root>
  );
}
