import { Callout, Card, Text, VStack } from "@roll-and-call/ui";

import { LineBreaks } from "@/shared/ui";

interface ConfirmAttendanceSummaryProps {
  presentCount: number;
  absentNames: string;
  warningLines: string[];
}

const ROW_CLASS = "flex [&>*+*]:border-l";
const LABEL_CLASS = "w-18 flex-none border-gray-200 bg-gray-50 px-150 py-125";

export function ConfirmAttendanceSummary({
  presentCount,
  absentNames,
  warningLines,
}: ConfirmAttendanceSummaryProps) {
  return (
    <VStack gap="150">
      <Card.Root
        radius={400}
        padding="none"
        className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-gray-200"
      >
        <div className={ROW_CLASS}>
          <div className={LABEL_CLASS}>
            <Text typography="body4" foreground="muted">
              참석
            </Text>
          </div>
          <div className="min-w-0 flex-1 border-gray-200 px-150 py-125">
            <Text typography="body3" numeric>
              {presentCount}명
            </Text>
          </div>
        </div>
        <div className={ROW_CLASS}>
          <div className={LABEL_CLASS}>
            <Text typography="body4" foreground="muted">
              불참
            </Text>
          </div>
          <div className="min-w-0 flex-1 border-gray-200 px-150 py-125">
            <Text typography="body3" weight="bold" foreground="danger">
              {absentNames}
            </Text>
          </div>
        </div>
      </Card.Root>
      <Callout.Root colorPalette="warning" size="sm">
        <Callout.Icon />
        <Callout.Title>불참 기록이 남습니다</Callout.Title>
        <Callout.Description className="break-keep">
          <LineBreaks lines={warningLines} />
        </Callout.Description>
      </Callout.Root>
    </VStack>
  );
}
