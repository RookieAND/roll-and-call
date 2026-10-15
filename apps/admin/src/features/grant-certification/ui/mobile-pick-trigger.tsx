import { Button, Sheet, Text, VStack } from "@roll-and-call/ui";
import { ChevronDown } from "lucide-react";

interface MobilePickTriggerProps {
  label: string;
  description: string;
  disabled: boolean;
}

// 긴 목록은 화면에 펼치지 않고 이 한 줄을 눌러 여는 시트에서 고른다.
export function MobilePickTrigger({ label, description, disabled }: MobilePickTriggerProps) {
  return (
    <Sheet.Trigger
      disabled={disabled}
      render={
        <Button
          variant="outline"
          colorPalette="gray"
          className="h-auto min-h-14 w-full justify-between gap-125 rounded-600 px-150 py-100 text-left font-normal"
        />
      }
    >
      <VStack gap="025" className="min-w-0 flex-1" render={<span />}>
        <Text typography="body3" weight="bold">
          {label}
        </Text>
        <Text typography="body4" foreground="muted">
          {description}
        </Text>
      </VStack>
      <ChevronDown size={18} aria-hidden className="shrink-0 text-hint" />
    </Sheet.Trigger>
  );
}
