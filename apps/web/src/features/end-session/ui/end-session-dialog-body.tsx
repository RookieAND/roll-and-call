import { Callout, Text, VStack } from "@roll-and-call/ui";

import { formatDateTime } from "@/shared/lib";

interface EndSessionDialogBodyProps {
  plannedEndAt: Date;
  lastRound: boolean;
  failed: boolean;
}

export function EndSessionDialogBody({
  plannedEndAt,
  lastRound,
  failed,
}: EndSessionDialogBodyProps) {
  return (
    <VStack gap="150">
      {lastRound && (
        <Text typography="body3" foreground="muted">
          마지막 회차입니다. 마치면 구인이 끝납니다.
        </Text>
      )}
      <Callout.Root colorPalette="gray">
        <Callout.Icon />
        <Callout.Description>예정 종료 {formatDateTime(plannedEndAt)}</Callout.Description>
      </Callout.Root>
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
