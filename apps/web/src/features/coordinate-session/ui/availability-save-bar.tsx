import { Button, HStack, Text, VStack } from "@roll-and-call/ui";

import { UnsavedCount } from "./unsaved-count";

interface AvailabilitySaveBarProps {
  selectedCount: number;
  unsavedCount: number;
  dirty: boolean;
  pending: boolean;
  onReset: () => void;
  onSave: () => void;
}

export function AvailabilitySaveBar({
  selectedCount,
  unsavedCount,
  dirty,
  pending,
  onReset,
  onSave,
}: AvailabilitySaveBarProps) {
  return (
    <VStack
      gap="125"
      className="sticky bottom-0 z-10 -mx-200 border-t border-gray-200 bg-surface px-200 pt-150 pb-200"
    >
      <HStack align="center" gap="075">
        <Text typography="subtitle2" numeric render={<span />}>
          선택 {selectedCount}칸
        </Text>
        {dirty ? <UnsavedCount count={unsavedCount} /> : null}
      </HStack>
      <HStack gap="100" className="[&>*]:flex-1">
        {dirty && (
          <Button
            type="button"
            variant="outline"
            className="h-[50px] rounded-500"
            onClick={onReset}
          >
            되돌리기
          </Button>
        )}
        <Button
          type="button"
          className="h-[50px] rounded-500 font-bold"
          loading={pending}
          disabled={!dirty}
          onClick={onSave}
        >
          저장
        </Button>
      </HStack>
    </VStack>
  );
}
