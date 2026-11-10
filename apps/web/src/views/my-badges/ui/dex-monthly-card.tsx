import { Badge, HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { BadgeMedal } from "@/entities/badge";
import { BadgeDetailSheet } from "@/features/view-badge";

import type { MonthlyCard } from "../model/monthly-card";

interface DexMonthlyCardProps {
  card: MonthlyCard;
}

export function DexMonthlyCard({ card }: DexMonthlyCardProps) {
  const standing = card.standing;
  return (
    <BadgeDetailSheet
      detail={card.detail}
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-600 border bg-surface text-left",
        card.held ? "border-rank-gold" : "border-gray-200",
      )}
    >
      <div className="flex items-center gap-150 px-175 pt-200 pb-175 desktop:flex-col desktop:gap-125 desktop:text-center">
        <BadgeMedal
          emoji={card.emoji}
          look={card.look}
          locked={!card.held}
          ribbon={card.ribbon}
          size="lg"
        />
        <VStack gap="075" className="min-w-0 desktop:items-center">
          <Badge
            colorPalette={card.held ? "warning" : "gray"}
            className="self-start desktop:self-center"
          >
            {card.held ? "현재 보유" : "도전 중"}
          </Badge>
          <Text typography="subtitle1" weight="extrabold">
            {standing.month} 집계 중
          </Text>
          {standing.rank && (
            <Text typography="body4" foreground="muted">
              현재 {standing.rank}
            </Text>
          )}
        </VStack>
      </div>

      <div className="mx-175 grid grid-cols-2 divide-x divide-gray-200 rounded-400 bg-gray-50 py-150">
        <VStack align="center" gap="075" className="px-075">
          <Text typography="body4" foreground="muted">
            {standing.label}
          </Text>
          <HStack align="baseline" gap="025">
            <Text typography="heading1" numeric foreground="primary">
              {standing.count}
            </Text>
            <Text typography="body3" foreground="muted">
              {standing.unit}
            </Text>
          </HStack>
        </VStack>
        <VStack align="center" gap="075" className="px-075">
          <Text typography="body4" foreground="muted">
            현재 1위
          </Text>
          <HStack align="baseline" gap="025">
            <Text typography="heading1" numeric>
              {standing.topCount}
            </Text>
            <Text typography="body3" foreground="muted">
              {standing.unit}
            </Text>
          </HStack>
        </VStack>
      </div>

      <VStack gap="125" className="px-175 py-175">
        {card.held && (
          <VStack gap="050" className="rounded-300 bg-warning-50 px-125 py-100">
            <Text typography="body4" weight="bold">
              {card.status}
            </Text>
            <Text typography="body4" foreground="muted" className="break-keep">
              {card.description}
            </Text>
          </VStack>
        )}
        <VStack gap="050">
          <Text typography="body4" weight="bold" foreground="muted">
            획득 조건
          </Text>
          <Text typography="body4" foreground="hint" className="break-keep text-pretty">
            {card.condition}
          </Text>
        </VStack>
      </VStack>

      <HStack align="center" gap="075" className="min-h-11 border-t border-gray-200 px-175 py-100">
        <VStack gap="025" className="min-w-0 flex-1">
          <Text typography="body4" weight="bold" foreground="muted">
            획득 이력
          </Text>
          <Text typography="body4" foreground="hint" className="break-keep">
            {card.history}
          </Text>
        </VStack>
        <ChevronRight size={16} aria-hidden className="shrink-0 text-hint" />
      </HStack>
    </BadgeDetailSheet>
  );
}
