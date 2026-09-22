import { HStack } from "@roll-and-call/ui";

import { capacityParts } from "../model/capacity-parts";
import { CapacityLabel } from "./capacity-label";
import { CapacityValue } from "./capacity-value";

export function GameCapacity(input: Parameters<typeof capacityParts>[0]) {
  return (
    <HStack
      align="center"
      className="h-[26px] shrink-0 gap-100 rounded-300 border border-gray-200 bg-gray-50 px-125"
    >
      {capacityParts(input).map((part) =>
        part.emphasis ? (
          <CapacityValue key={part.text} text={part.text} />
        ) : (
          <CapacityLabel key={part.text} text={part.text} />
        ),
      )}
    </HStack>
  );
}
