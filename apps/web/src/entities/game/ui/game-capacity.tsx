import { HStack } from "@trpg/ui";

import { capacityParts } from "../model/capacity-parts";
import { CapacityText } from "./capacity-text";

export function GameCapacity(input: Parameters<typeof capacityParts>[0]) {
  return (
    <HStack
      align="center"
      className="h-[26px] shrink-0 gap-2 rounded-300 border border-gray-200 bg-gray-50 px-2.5"
    >
      {capacityParts(input).map((part) => (
        <CapacityText key={part.text} part={part} />
      ))}
    </HStack>
  );
}
