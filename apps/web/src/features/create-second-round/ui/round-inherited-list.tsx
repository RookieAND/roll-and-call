import { HStack, Text, VStack } from "@trpg/ui";
import { Check } from "lucide-react";

export function RoundInheritedList({
  waitingCount,
  maxPlayers,
}: {
  waitingCount: number;
  maxPlayers: number;
}) {
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
    <VStack gap={2}>
      <Text typography="body4" foreground="muted" className="font-bold">
        그대로 넘어가는 것
      </Text>
      <div className="overflow-hidden rounded-xl border border-gray-200">
        {items.map((item) => (
          <HStack
            key={item.title}
            align="center"
            gap={3}
            className="min-h-13 border-b border-gray-100 px-3 py-2.5 last:border-b-0"
          >
            <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary-600 text-white">
              <Check size={12} aria-hidden />
            </span>
            <VStack gap={0}>
              <Text typography="subtitle2">{item.title}</Text>
              <Text typography="body4" foreground="hint">
                {item.description}
              </Text>
            </VStack>
          </HStack>
        ))}
      </div>
    </VStack>
  );
}
