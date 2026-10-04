import { Text, VStack } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";

interface PaletteMessageProps {
  title: string;
  hint?: string;
}

export function PaletteMessage({ title, hint }: PaletteMessageProps) {
  return (
    <VStack gap="050" className="px-200 py-300">
      <Text typography="body3" foreground="hint">
        {title}
      </Text>
      {isUndefined(hint) ? null : (
        <Text typography="body4" foreground="hint">
          {hint}
        </Text>
      )}
    </VStack>
  );
}
