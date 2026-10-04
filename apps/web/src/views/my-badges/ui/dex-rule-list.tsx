import { Card, HStack, Progress, Text, VStack } from "@roll-and-call/ui";

import { BadgeMedal } from "@/entities/badge";
import { BadgeDetailSheet } from "@/features/view-badge";

import type { RuleRow } from "../model/rule-rows";
import { DexTierDots } from "./dex-tier-dots";

interface DexRuleListProps {
  rows: RuleRow[];
  emptyText: string;
}

export function DexRuleList({ rows, emptyText }: DexRuleListProps) {
  if (rows.length === 0) {
    return (
      <Text
        typography="body3"
        foreground="hint"
        className="rounded-500 border border-dashed border-gray-300 p-175"
      >
        {emptyText}
      </Text>
    );
  }
  return (
    <Card.Root padding="none" radius={600} className="overflow-hidden">
      {rows.map((row) => {
        const nextLabel = row.next?.label ?? "마지막 단계입니다";
        const nextClass = row.next ? "text-gray-600" : "text-rank-gold";
        return (
          <BadgeDetailSheet
            key={row.key}
            detail={row.detail}
            className="flex w-full items-center gap-150 border-t border-gray-200 px-175 py-150 text-left first:border-t-0 hover:bg-gray-50"
          >
            <BadgeMedal emoji={row.emoji} look={row.look} size="sm" />
            <VStack gap="075" className="min-w-0 flex-1">
              <HStack align="center" gap="100">
                <Text typography="subtitle1" weight="extrabold" truncate className="min-w-0 flex-1">
                  {row.name}
                </Text>
                <DexTierDots tier={row.tier} stepCount={row.stepCount} tone={row.tone} />
              </HStack>
              <HStack align="baseline" gap="075">
                <Text
                  typography="body4"
                  weight="bold"
                  foreground="inherit"
                  className={`min-w-0 flex-1 ${nextClass}`}
                >
                  {nextLabel}
                </Text>
                <Text typography="body4" foreground="hint" numeric>
                  {row.countLabel}
                </Text>
              </HStack>
              {row.next && <Progress value={row.next.value} max={row.next.max} variant="tinted" />}
            </VStack>
          </BadgeDetailSheet>
        );
      })}
    </Card.Root>
  );
}
