import { Card, HStack, Text, VStack } from "@roll-and-call/ui";
import { CircleCheck } from "lucide-react";

interface NextRoundCarryListProps {
  waitingCount: number;
}

// 가능 시간은 넘기지 않으므로 「이미 낸 가능 시간」 줄은 두지 않는다.
export function NextRoundCarryList({ waitingCount }: NextRoundCarryListProps) {
  const rows = [
    { title: "구인 정보", description: "룰 · 시놉시스 · 플레이타임" },
    { title: `대기 ${waitingCount}명`, description: "다음 회차의 확정 참여자가 됩니다" },
  ];

  return (
    <VStack gap="100">
      <Text typography="body4" weight="bold" foreground="muted">
        그대로 넘어가는 것
      </Text>
      <Card.Root
        padding="none"
        radius={500}
        className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-gray-200"
      >
        {rows.map((row) => (
          <HStack key={row.title} align="center" gap="125" className="px-175 py-150">
            <CircleCheck size={18} aria-hidden className="shrink-0 text-success-700" />
            <VStack gap="025" className="min-w-0">
              <Text typography="subtitle2">{row.title}</Text>
              <Text typography="body4" foreground="hint">
                {row.description}
              </Text>
            </VStack>
          </HStack>
        ))}
      </Card.Root>
    </VStack>
  );
}
