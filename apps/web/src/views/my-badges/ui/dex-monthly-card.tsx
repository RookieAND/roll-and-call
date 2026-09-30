import { HStack, Text, VStack, cn } from "@roll-and-call/ui";

import { BadgeMedal } from "@/entities/badge";
import { BadgeDetailSheet } from "@/features/view-badge";

import type { MonthlyCard } from "../model/monthly-card";

interface DexMonthlyCardProps {
  card: MonthlyCard;
}

// 지금 달고 있으면 금색 테두리 카드, 아니면 이번 달 순위만 보여 준다.
export function DexMonthlyCard({ card }: DexMonthlyCardProps) {
  const frameClass = card.held ? "border-rank-gold bg-warning-50" : "border-gray-200";
  return (
    <BadgeDetailSheet
      detail={card.detail}
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-600 border text-left",
        frameClass,
      )}
    >
      <HStack align="center" gap="175" className="px-175 pt-200 pb-225">
        <BadgeMedal
          emoji={card.emoji}
          grade={card.grade}
          locked={!card.held}
          ribbon={card.ribbon}
          isNew={card.isNew}
          size="lg"
        />
        <VStack gap="050" className="min-w-0 flex-1">
          <Text typography="subtitle1" weight="extrabold">
            {card.status}
          </Text>
          <Text typography="body3" foreground="muted" className="[text-wrap:pretty]">
            {card.description}
          </Text>
        </VStack>
      </HStack>
      <Text
        typography="body4"
        foreground="muted"
        className={cn("flex min-h-10 w-full items-center border-t px-175", frameClass)}
      >
        {card.history}
      </Text>
    </BadgeDetailSheet>
  );
}
