import { Text } from "@trpg/ui";

export function GameSeatCount({ current, max }: { current: number; max: number }) {
  return (
    <Text numeric typography="subtitle1">
      {current}/{max}
    </Text>
  );
}
