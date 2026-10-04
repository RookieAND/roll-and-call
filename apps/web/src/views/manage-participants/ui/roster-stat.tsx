import { Card, Text, VStack } from "@roll-and-call/ui";

import { STAT_TONE, type StatTone } from "../model/stat-tone";

const TONE = {
  [STAT_TONE.neutral]: { card: "bg-surface", label: "hint", value: "normal" },
  [STAT_TONE.primary]: {
    card: "border-tinted-border bg-tinted-bg",
    label: "primary",
    value: "primary",
  },
  [STAT_TONE.success]: {
    card: "border-success-200 bg-success-100",
    label: "success",
    value: "success",
  },
} as const;

interface RosterStatProps {
  label: string;
  value: string;
  tone?: StatTone;
}

export function RosterStat({ label, value, tone = STAT_TONE.neutral }: RosterStatProps) {
  const style = TONE[tone];
  return (
    <Card.Root padding="sm" radius={500} background="none" className={style.card}>
      <VStack gap="050" className="px-025">
        <Text typography="body4" foreground={style.label}>
          {label}
        </Text>
        <Text numeric typography="heading2" foreground={style.value}>
          {value}
        </Text>
      </VStack>
    </Card.Root>
  );
}
