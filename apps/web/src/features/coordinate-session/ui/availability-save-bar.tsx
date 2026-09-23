import { Button, FloatingBar, HStack, Text } from "@roll-and-call/ui";

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
    <FloatingBar.Root elevated={false}>
      <FloatingBar.Content>
        <HStack align="center" gap="075" className="mb-125">
          <Text typography="subtitle2" numeric render={<span />}>
            선택 {selectedCount}칸
          </Text>
          {dirty ? (
            <UnsavedCount count={unsavedCount} />
          ) : (
            <Text typography="body4" foreground="hint" render={<span />}>
              · 모두 저장됨
            </Text>
          )}
        </HStack>
        <HStack gap="100" className="[&>*]:flex-1">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={!dirty}
            onClick={onReset}
          >
            되돌리기
          </Button>
          <Button
            type="button"
            size="lg"
            loading={pending}
            disabled={!dirty}
            onClick={onSave}
          >
            저장
          </Button>
        </HStack>
      </FloatingBar.Content>
      <FloatingBar.Spacer />
    </FloatingBar.Root>
  );
}
