import { HStack, Text, VStack, cn } from "@roll-and-call/ui";

import { BadgeMedal, TIER_NAME } from "@/entities/badge";

import { LADDER_MEDALS } from "../model/demo-medals";
import { TIER_LABEL_CLASS } from "../model/tier-label-class";

export function BadgeLadder() {
  return (
    <VStack gap="100">
      <Text typography="body5" weight="bold" foreground="hint">
        단계가 오를수록 테두리가 바뀝니다
      </Text>
      <HStack align="center" justify="between" className="relative px-025 pt-050">
        <span
          aria-hidden
          className="absolute top-[calc(50%-8px)] right-7.5 left-4.5 h-0.75 rounded-full"
          style={{
            backgroundImage:
              "linear-gradient(90deg, var(--rc-color-border-strong), var(--rc-color-fg-rank-bronze), var(--rc-color-border-primary), var(--rc-color-fg-rank-gold), var(--rc-color-data-purple-ink))",
          }}
        />
        {LADDER_MEDALS.map((medal) => (
          <VStack key={medal.grade} align="center" gap="050" className="relative">
            <BadgeMedal emoji={medal.emoji} look={medal.grade} size={medal.size} />
            <Text
              typography="body5"
              weight="extrabold"
              className={cn("whitespace-nowrap", TIER_LABEL_CLASS[medal.grade])}
            >
              {TIER_NAME[medal.grade]}
            </Text>
          </VStack>
        ))}
      </HStack>
    </VStack>
  );
}
