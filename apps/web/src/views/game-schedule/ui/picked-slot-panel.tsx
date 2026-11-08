import { Card, Text, VStack } from "@roll-and-call/ui";

import { PickedSlotPeople } from "./picked-slot-people";

interface PickedSlotPanelProps {
  picked: string | null;
  names: Record<string, string[]>;
  gmName?: string;
  interactive: boolean;
}

// 1100px 이상 「겹치는 시간」 탭 오른쪽 패널. 모바일에서 격자 아래에 있던 고른 칸을 옮겨 온다.
export function PickedSlotPanel({ picked, names, gmName, interactive }: PickedSlotPanelProps) {
  return (
    <Card.Root background="subtle" render={<section />}>
      <VStack gap="150">
        <Text typography="subtitle1" render={<h2 />}>
          고른 시간
        </Text>
        {interactive &&
          (picked ? (
            <PickedSlotPeople slotIso={picked} names={names[picked] ?? []} gmName={gmName} />
          ) : (
            <Text typography="body4" foreground="hint" render={<p />}>
              칸을 누르면 그 시간에 가능한 사람이 보입니다.
            </Text>
          ))}
      </VStack>
    </Card.Root>
  );
}
