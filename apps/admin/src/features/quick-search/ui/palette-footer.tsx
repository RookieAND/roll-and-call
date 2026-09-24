import { HStack, Text } from "@roll-and-call/ui";

import { Kbd } from "@/shared/ui";

const HINTS = [
  { keys: ["↑", "↓"], label: "이동" },
  { keys: ["↵"], label: "열기" },
  { keys: ["⌘", "↵"], label: "새 탭에서 열기" },
] as const;

export function PaletteFooter() {
  return (
    <HStack
      align="center"
      gap="150"
      className="border-t border-(--rc-color-border-subtle) bg-gray-50 px-175 py-125"
    >
      {HINTS.map((hint) => (
        <HStack key={hint.label} align="center" gap="050">
          {hint.keys.map((key) => (
            <Kbd key={key}>{key}</Kbd>
          ))}
          <Text typography="body4" foreground="hint">
            {hint.label}
          </Text>
        </HStack>
      ))}
      <Text typography="body4" foreground="hint" className="ml-auto">
        Windows에서는 Ctrl + K를 누릅니다
      </Text>
    </HStack>
  );
}
