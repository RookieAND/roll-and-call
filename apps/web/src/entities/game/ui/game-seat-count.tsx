import { Text } from "@trpg/ui";

export function GameSeatCount({ current, max }: { current: number; max: number }) {
  return (
    <Text typography="subtitle1" className="tabular-nums">
      {current}/{max}
    </Text>
  );
}
