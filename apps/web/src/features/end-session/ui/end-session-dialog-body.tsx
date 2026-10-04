import { Callout, VStack } from "@roll-and-call/ui";

import { formatDateTime } from "@/shared/lib";

interface EndSessionDialogBodyProps {
  plannedEndAt: Date;
  failed: boolean;
}

export function EndSessionDialogBody({ plannedEndAt, failed }: EndSessionDialogBodyProps) {
  return (
    <VStack gap="150">
      <Callout.Root colorPalette="gray">
        <Callout.Description>예정 종료 {formatDateTime(plannedEndAt)}</Callout.Description>
      </Callout.Root>
      {failed && (
        <Callout.Root colorPalette="danger">
          <Callout.Icon />
          <Callout.Title>세션을 마치지 못했습니다.</Callout.Title>
          <Callout.Description>잠시 뒤 다시 시도해 주세요.</Callout.Description>
        </Callout.Root>
      )}
    </VStack>
  );
}
