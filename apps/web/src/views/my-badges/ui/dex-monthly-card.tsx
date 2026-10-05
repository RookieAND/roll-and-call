import { HStack, Text, VStack, cn } from "@roll-and-call/ui";

import { BadgeMedal, ScoreRuleLink } from "@/entities/badge";
import { BadgeDetailSheet } from "@/features/view-badge";

import type { MonthlyCard } from "../model/monthly-card";

interface DexMonthlyCardProps {
  card: MonthlyCard;
}

// 이번 달 줄에 점수 기준 아이콘이 있어 카드 전체를 버튼으로 감쌀 수 없다. 위쪽과 아래 기록 줄이 각각 상세 시트를 연다.
export function DexMonthlyCard({ card }: DexMonthlyCardProps) {
  const frameClass = card.held ? "border-rank-gold bg-warning-50" : "border-gray-200";
  return (
    <div className={cn("flex w-full flex-col overflow-hidden rounded-600 border", frameClass)}>
      <BadgeDetailSheet detail={card.detail} className="w-full text-left">
        <HStack align="center" gap="175" className="px-175 pt-200 pb-225">
          <BadgeMedal
            emoji={card.emoji}
            look={card.look}
            locked={!card.held}
            ribbon={card.ribbon}
            size="lg"
          />
          <VStack gap="050" className="min-w-0 flex-1">
            {card.status && (
              <Text typography="subtitle1" weight="extrabold" className="break-keep">
                {card.status}
              </Text>
            )}
            <Text typography="body3" foreground="muted" className="break-keep [text-wrap:pretty]">
              {card.description}
            </Text>
          </VStack>
        </HStack>
      </BadgeDetailSheet>
      <HStack align="center" className={cn("min-h-11 border-t pr-025 pl-175", frameClass)}>
        <Text
          typography="body4"
          weight="bold"
          numeric
          className="min-w-0 flex-1 break-keep [text-wrap:pretty]"
        >
          {card.monthLine}
        </Text>
        <ScoreRuleLink />
      </HStack>
      <BadgeDetailSheet detail={card.detail} className="w-full text-left">
        <Text
          typography="body4"
          foreground="muted"
          className={cn("flex min-h-10 w-full items-center border-t px-175", frameClass)}
        >
          {card.history}
        </Text>
      </BadgeDetailSheet>
    </div>
  );
}
