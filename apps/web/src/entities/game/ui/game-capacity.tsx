import { HStack, Text, cn } from "@roll-and-call/ui";
import { Users } from "lucide-react";

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
          aria-label={cell.icon === "participants" ? `참여자 ${cell.text}명` : undefined}
          className={cn("flex items-center gap-050 px-100", SEAT_CELL_CLASS[cell.tone])}
        >
          {cell.icon === "participants" && <Users size={14} aria-hidden className="shrink-0" />}
          {cell.text}
        </Text>
      ))}
    </HStack>
  );
}
