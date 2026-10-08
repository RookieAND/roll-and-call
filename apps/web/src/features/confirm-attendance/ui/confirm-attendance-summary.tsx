import { Callout, HStack, Text, VStack } from "@roll-and-call/ui";

import { LineBreaks } from "@/shared/ui";

interface ConfirmAttendanceSummaryProps {
  presentCount: number;
  absentNames: string;
  warningLines: string[];
  notice: string;
}

export function ConfirmAttendanceSummary({
  presentCount,
  absentNames,
  warningLines,
  notice,
}: ConfirmAttendanceSummaryProps) {
  return (
    <VStack gap="150">
      <VStack gap="100" className="rounded-400 bg-gray-50 px-175 py-150">
        <HStack align="baseline" gap="150">
          <Text typography="body5" foreground="hint" className="w-10 flex-none">
            참석
          </Text>
          <Text typography="body3" numeric>
            {presentCount}명
          </Text>
        </HStack>
        <HStack align="baseline" gap="150">
          <Text typography="body5" foreground="hint" className="w-10 flex-none">
            불참
          </Text>
          <Text typography="body3" weight="bold" foreground="danger">
            {absentNames}
          </Text>
        </HStack>
      </VStack>
      <Callout.Root colorPalette="warning" size="sm">
        <Callout.Icon />
        <Callout.Title>불참 기록이 남습니다</Callout.Title>
        <Callout.Description className="break-keep">
          <LineBreaks lines={warningLines} />
        </Callout.Description>
      </Callout.Root>
      <Text typography="body4" foreground="muted" render={<p />}>
        {notice}
      </Text>
    </VStack>
  );
}
