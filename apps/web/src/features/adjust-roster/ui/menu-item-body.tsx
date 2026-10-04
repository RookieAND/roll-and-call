import { Text, VStack } from "@roll-and-call/ui";

import { LineBreaks } from "@/shared/ui";

interface MenuItemBodyProps {
  label: string;
  lines?: readonly string[];
}

export function MenuItemBody({ label, lines = [] }: MenuItemBodyProps) {
  return (
    <VStack gap="025" align="start" className="min-w-0 flex-1 text-left">
      <Text typography="body2" weight="bold" foreground="inherit">
        {label}
      </Text>
      {lines.length > 0 && (
        <Text typography="body4" foreground="hint" className="[text-wrap:pretty]">
          <LineBreaks lines={lines} />
        </Text>
      )}
    </VStack>
  );
}
