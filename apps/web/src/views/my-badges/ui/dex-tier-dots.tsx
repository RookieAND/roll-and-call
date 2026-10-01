import { HStack, cn } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { BADGE_TONE, type BadgeTone } from "@/entities/badge";

const DOT_CLASS: Record<BadgeTone, string> = {
  [BADGE_TONE.muted]: "bg-gray-600",
  [BADGE_TONE.bronze]: "bg-rank-bronze",
  [BADGE_TONE.primary]: "bg-tinted-ink",
  [BADGE_TONE.gold]: "bg-rank-gold",
  [BADGE_TONE.prism]: "bg-badge-prism",
  [BADGE_TONE.developer]: "bg-badge-developer",
  [BADGE_TONE.guild]: "bg-badge-guild",
  [BADGE_TONE.hint]: "bg-hint",
  [BADGE_TONE.success]: "bg-success-700",
};

interface DexTierDotsProps {
  tier: number;
  stepCount: number;
  tone: BadgeTone;
}

export function DexTierDots({ tier, stepCount, tone }: DexTierDotsProps) {
  return (
    <HStack gap="025" role="img" aria-label={`${stepCount}단계 중 ${tier}단계`}>
      {range(stepCount).map((index) => (
        <span
          key={index}
          className={cn("size-1.5 rounded-full", index < tier ? DOT_CLASS[tone] : "bg-gray-200")}
        />
      ))}
    </HStack>
  );
}
