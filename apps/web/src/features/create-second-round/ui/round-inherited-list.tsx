import { Card, HStack, Text, VStack } from "@roll-and-call/ui";
import { Check } from "lucide-react";

interface RoundInheritedListProps {
  waitingCount: number;
  maxPlayers: number;
}

export function RoundInheritedList({ waitingCount, maxPlayers }: RoundInheritedListProps) {
  const carriedDescription =
    waitingCount > maxPlayers
      ? `앞의 ${maxPlayers}명이 다음 회차의 확정 참여자가 되고, 나머지는 대기로 넘어갑니다`
      : "다음 회차의 확정 참여자가 됩니다";
  const items = [
    { title: "게임 정보", description: "룰 · 시놉시스 · 플레이타임" },
    { title: `대기 ${waitingCount}명`, description: carriedDescription },
    { title: "이미 낸 가능 시간", description: "조율을 처음부터 다시 하지 않습니다" },
  ];

  return (
    <VStack gap="100">
      <Text weight="bold" typography="body4" foreground="muted">
        그대로 넘어가는 것
      </Text>
      <Card radius={500} background="none" padding="none" className="overflow-hidden">
        {items.map((item) => (
          <HStack
            key={item.title}
            align="center"
            gap="150"
            className="min-h-13 border-b border-gray-100 px-150 py-125 last:border-b-0"
          >
            <Check size={16} strokeWidth={2.6} aria-hidden className="shrink-0 text-success-600" />
            <VStack gap={0}>
              <Text typography="body4" weight="bold">
                {item.title}
              </Text>
              <Text typography="body4" foreground="hint">
                {item.description}
              </Text>
            </VStack>
          </HStack>
        ))}
      </Card>
    </VStack>
  );
}
