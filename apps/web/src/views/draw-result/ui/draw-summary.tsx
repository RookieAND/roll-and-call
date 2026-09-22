import { Badge, Grid, HStack, Text, VStack } from "@trpg/ui";

import { DrawStat } from "./draw-stat";

interface DrawSummaryProps {
  title: string;
  applicantCount: number;
  resultLabel: string;
  resultCount: number;
  applied: boolean;
}

export function DrawSummary({
  title,
  applicantCount,
  resultLabel,
  resultCount,
  applied,
}: DrawSummaryProps) {
  const resultTone = applied ? "success" : "tinted";

  return (
    <VStack gap="150">
      <HStack align="center" gap="100">
        <Text typography="heading3" weight="extrabold" truncate className="min-w-0 flex-1">
          {title}
        </Text>
        <Badge color="primary" className="font-mono">
          1d100
        </Badge>
      </HStack>
      <Grid cols={2} gap="100">
        <DrawStat label="신청" count={applicantCount} tone="plain" />
        <DrawStat label={resultLabel} count={resultCount} tone={resultTone} />
      </Grid>
    </VStack>
  );
}
