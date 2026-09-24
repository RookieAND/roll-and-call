import { HStack, Text } from "@roll-and-call/ui";

const LEVELS = [0, 1, 2, 3, 4, 5] as const;

interface HeatScaleProps {
  caption: string;
}

export function HeatScale({ caption }: HeatScaleProps) {
  return (
    <HStack align="center" gap="075" className="mt-125 pl-500">
      <Text typography="body4" foreground="hint">
        적음
      </Text>
      {LEVELS.map((level) => (
        <span
          key={level}
          aria-hidden
          className="h-[10px] w-[20px] rounded-100"
          style={{ background: level ? `var(--color-heat-${level})` : "var(--color-gray-100)" }}
        />
      ))}
      <Text typography="body4" foreground="hint">
        많음
      </Text>
      <Text typography="body4" foreground="hint" className="ml-auto">
        {caption}
      </Text>
    </HStack>
  );
}
