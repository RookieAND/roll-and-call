import { Text } from "@roll-and-call/ui";

interface DeltaProps {
  value: number;
  unit: string;
  // 늘어나면 나쁜 지표(불참률 등)
  higherIsWorse?: boolean;
}

export function Delta({ value, unit, higherIsWorse = false }: DeltaProps) {
  const arrow = value > 0 ? "▲" : value < 0 ? "▼" : "–";
  const foreground = higherIsWorse && value > 0 ? "danger" : "muted";
  return (
    <Text
      typography="body4"
      weight="bold"
      foreground={foreground}
      numeric
      className="whitespace-nowrap"
    >
      {arrow} {Math.abs(value)}
      {unit}
    </Text>
  );
}
