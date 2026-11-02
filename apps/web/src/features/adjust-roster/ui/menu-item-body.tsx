import { HStack, Text } from "@roll-and-call/ui";

import { LineBreaks } from "@/shared/ui";

interface MenuItemBodyProps {
  label: string;
  lines?: readonly string[];
}

export function MenuItemBody({ label, lines = [] }: MenuItemBodyProps) {
  return (
    <HStack align="center" gap="150" className="min-w-0 flex-1 text-left">
      <Text typography="body2" weight="bold" foreground="inherit" className="flex-none">
        {label}
      </Text>
      {lines.length > 0 && (
        <Text typography="body4" foreground="hint" className="flex-1 text-right [text-wrap:pretty]">
          <LineBreaks lines={lines} />
        </Text>
      )}
    </HStack>
  );
}
