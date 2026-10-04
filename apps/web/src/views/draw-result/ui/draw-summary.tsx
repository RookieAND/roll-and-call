import { Badge, Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { CircleCheck } from "lucide-react";

import { formatDateTime } from "@/shared/lib";
import { SummaryLine } from "@/shared/ui";

import { DrawRulesPopover } from "./draw-rules-popover";
import { DrawStat } from "./draw-stat";

interface DrawSummaryProps {
  title: string;
  applicantCount: number;
  confirmedCount: number;
  drawnAt: Date;
}

export function DrawSummary({ title, applicantCount, confirmedCount, drawnAt }: DrawSummaryProps) {
  return (
    <VStack gap="150">
      <HStack align="center" gap="100">
        <Text typography="heading3" weight="extrabold" truncate className="min-w-0 flex-1">
          {title}
        </Text>
        <Badge colorPalette="primary" className="font-mono">
          1d100
        </Badge>
        <DrawRulesPopover />
      </HStack>
      <Grid cols={2} gap="100">
        <DrawStat label="신청" count={applicantCount} tone="plain" />
        <DrawStat label="확정" count={confirmedCount} tone="success" />
      </Grid>
      <SummaryLine
        icon={CircleCheck}
        tone="success"
        label="추첨"
        value={formatDateTime(drawnAt)}
        badge="완료"
      />
    </VStack>
  );
}
