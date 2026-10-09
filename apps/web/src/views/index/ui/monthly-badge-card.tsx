import { HStack, Text, VStack } from "@roll-and-call/ui";

import { BadgeMedal } from "@/entities/badge";

// 기간제 뱃지 예시. 이달의 GM은 다음 달 말까지 보인다.
export function MonthlyBadgeCard() {
  return (
    <HStack
      align="center"
      gap="175"
      className="rounded-500 px-175 py-150"
      style={{
        backgroundImage:
          "linear-gradient(120deg, var(--rc-color-bg-warning-weak), var(--rc-color-bg-canvas-raised) 70%)",
      }}
    >
      <div className="relative flex-none pb-100">
        <BadgeMedal emoji="🎖️" look={4} size="md" />
        <span className="absolute bottom-0 left-1/2 h-4.5 -translate-x-1/2 rounded-full bg-primary-500 px-100 text-body5 leading-4.5 font-extrabold whitespace-nowrap text-on-primary ring-2 ring-surface">
          9월
        </span>
      </div>
      <VStack gap="025" className="min-w-0 flex-1">
        <Text typography="body5" weight="extrabold" className="text-rank-gold">
          기간제 뱃지
        </Text>
        <Text typography="subtitle2" weight="extrabold" className="whitespace-nowrap">
          이달의 GM
        </Text>
        <Text typography="body4" foreground="muted" truncate>
          9월 운영 1위 · 10월 31일까지
        </Text>
      </VStack>
    </HStack>
  );
}
