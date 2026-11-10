import { HStack, Text, cn } from "@roll-and-call/ui";

import { seatCount } from "../model/seat-count";
import { SEAT_CELL_CLASS } from "./seat-cell-class";

export type GameCapacityProps = Parameters<typeof seatCount>[0];

export function GameCapacity(input: GameCapacityProps) {
  return (
    <HStack
      align="stretch"
      className="h-6.5 shrink-0 overflow-hidden rounded-300 border border-gray-200 bg-gray-50"
    >
      {seatCount(input).map((cell) => (
        <Text
          key={cell.text}
          typography="body4"
          numeric
          render={<span />}
          className={cn("flex items-center gap-050 px-100", SEAT_CELL_CLASS[cell.tone])}
        >
          {cell.text}
        </Text>
      ))}
    </HStack>
  );
}
