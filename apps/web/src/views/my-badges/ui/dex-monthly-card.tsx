import { HStack, Text, VStack, cn } from "@roll-and-call/ui";

import { BadgeMedal } from "@/entities/badge";
import { BadgeDetailSheet } from "@/features/view-badge";

import type { MonthlyCard } from "../model/monthly-card";

interface DexMonthlyCardProps {
  card: MonthlyCard;
}

function MonthLines({ lines }: { lines: string[] }) {
  return lines.map((line, index) => (
    <span key={line} className="desktop:block">
      {index > 0 && <span className="desktop:hidden"> · </span>}
      {line}
    </span>
  ));
}

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
          look={card.look}
          locked={!card.held}
          ribbon={card.ribbon}
          size="lg"
        />
        <VStack gap="050" className="min-w-0 flex-1">
          <Text typography="subtitle1" weight="extrabold" className="break-keep">
            {card.held ? card.status : <MonthLines lines={card.monthLines} />}
          </Text>
          <Text typography="body3" foreground="muted" className="break-keep text-pretty">
            {card.description}
          </Text>
          {card.monthLine && (
            <Text typography="body4" foreground="hint" numeric className="break-keep">
              <MonthLines lines={card.monthLines} />
            </Text>
          )}
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
