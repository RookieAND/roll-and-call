import { Text, VStack } from "@roll-and-call/ui";

interface ManageCancelNoteProps {
  note: string;
}

export function ManageCancelNote({ note }: ManageCancelNoteProps) {
  return (
    <VStack gap="025" align="center" className="min-w-0 flex-1 text-center">
      <Text typography="body4" foreground="hint">
        취소 사유
      </Text>
      <Text typography="body3" weight="extrabold" className="break-keep">
        {note}
      </Text>
    </VStack>
  );
}
