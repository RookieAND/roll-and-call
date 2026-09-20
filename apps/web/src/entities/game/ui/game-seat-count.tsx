import { Text } from "@trpg/ui";

interface GameSeatCountProps {
  current: number;
  max: number;
}

export function GameSeatCount({ current, max }: GameSeatCountProps) {
  return (
    <Text numeric typography="subtitle1">
      {current}/{max}
    </Text>
  );
}
