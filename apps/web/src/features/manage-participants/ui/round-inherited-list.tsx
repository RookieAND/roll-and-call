import { HStack, Text, VStack } from "@trpg/ui";
import { Check } from "lucide-react";

// 다음 회차가 1회차에서 그대로 가져오는 것들. GM이 "다시 세팅해야 하나" 걱정하지 않게 못박는다.
const INHERITED = [
  { title: "게임 정보", desc: "룰 · 시놉시스 · 플레이타임" },
  { title: "대기자 자동 초대", desc: "확정 참여로 승계" },
  { title: "입력한 가능 시간표", desc: "조율을 처음부터 다시 안 함" },
];

export function RoundInheritedList() {
  return (
    <VStack gap={2}>
      <Text typography="body4" foreground="muted" className="font-bold">
        승계할 항목
      </Text>
      <div className="overflow-hidden rounded-xl border border-gray-200">
        {INHERITED.map((item) => (
          <HStack
            key={item.title}
            align="center"
            gap={3}
            className="min-h-13 border-b border-gray-100 px-3 py-2.5 last:border-b-0"
          >
            <span className="flex size-5 items-center justify-center rounded-md bg-primary-600 text-white">
              <Check size={12} aria-hidden />
            </span>
            <VStack gap={0}>
              <Text typography="subtitle2">{item.title}</Text>
              <Text typography="body4" foreground="hint">
                {item.desc}
              </Text>
            </VStack>
          </HStack>
        ))}
      </div>
    </VStack>
  );
}
