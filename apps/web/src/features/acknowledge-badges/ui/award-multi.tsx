import type { BadgeLook } from "@roll-and-call/database/rules";
import { HStack, Sheet, Text, VStack, cn } from "@roll-and-call/ui";

import { BadgeMedal, TONE_CLASS } from "@/entities/badge";

import type { AwardSheet } from "../model/award-sheet";

const HIGHLIGHT_CLASS: Partial<Record<BadgeLook, string>> = {
  5: "border-badge-prism badge-frame-prism bg-(--badge-fill)",
  monthly: "border-rank-gold bg-warning-50",
  developer: "border-badge-developer badge-frame-developer bg-(--badge-fill)",
  guildMaster: "border-badge-guild badge-frame-guild bg-(--badge-fill)",
};

interface AwardMultiProps {
  sheet: Extract<AwardSheet, { kind: "multi" }>;
}

export function AwardMulti({ sheet }: AwardMultiProps) {
  return (
    <VStack gap="200">
      <VStack gap="050" className="px-050 pt-050">
        <Sheet.Title render={<Text typography="heading2" render={<h2 />} />}>
          새 업적 {sheet.items.length}개
        </Sheet.Title>
        {sheet.subtitle && (
          <Text typography="body2" foreground="muted" className="[text-wrap:pretty]">
            {sheet.subtitle}
          </Text>
        )}
      </VStack>
      <VStack gap="100" render={<ul />}>
        {sheet.items.map((item) => (
          <HStack
            key={item.key}
            align="center"
            gap="175"
            render={<li />}
            className={cn(
              "rounded-600 border px-175 py-150",
              HIGHLIGHT_CLASS[item.look] ?? "border-gray-200",
            )}
          >
            <BadgeMedal emoji={item.emoji} look={item.look} ribbon={item.ribbon} size="md" />
            <VStack gap="025" className="min-w-0 flex-1">
              <Text
                typography="body4"
                weight="bold"
                foreground="inherit"
                className={TONE_CLASS[item.tagTone]}
              >
                {item.tag}
              </Text>
              <Text typography="heading3" weight="extrabold">
                {item.name}
              </Text>
              <Text typography="body3" foreground="muted">
                {item.requirement}
              </Text>
            </VStack>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}
