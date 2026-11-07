import { Callout, Card, HStack, Text, VStack } from "@roll-and-call/ui";

import { formatDateTime } from "@/shared/lib";

interface EndSessionDialogBodyProps {
  plannedEndAt: Date;
  failed: boolean;
}

// 값 상자는 일정 확정 창(confirm-session의 SessionWindowSummary·SummaryRow)과 같은 모양이다.
export function EndSessionDialogBody({ plannedEndAt, failed }: EndSessionDialogBodyProps) {
  return (
    <VStack gap="150">
      <Card.Root background="subtle" padding="none" radius={500}>
        <HStack align="center" gap="125" className="min-h-10 px-175">
          <Text typography="body4" foreground="hint" render={<span />} className="flex-1">
            예정 종료
          </Text>
          <Text numeric typography="body3" weight="bold" render={<span />}>
            {formatDateTime(plannedEndAt)}
          </Text>
        </HStack>
      </Card.Root>
      {failed && (
        <Callout.Root colorPalette="danger" size="sm">
          <Callout.Icon />
          <Callout.Description>
            세션을 마치지 못했습니다. 잠시 뒤 다시 시도해 주세요.
          </Callout.Description>
        </Callout.Root>
      )}
    </VStack>
  );
}
