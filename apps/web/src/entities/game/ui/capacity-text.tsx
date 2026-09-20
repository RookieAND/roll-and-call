import { Text } from "@trpg/ui";

import type { CapacityPart } from "../model/capacity-parts";

export function CapacityText({ part }: { part: CapacityPart }) {
  if (part.emphasis) {
    return (
      <Text weight="bold" typography="body4" numeric>
        {part.text}
      </Text>
    );
  }
  return (
    <Text typography="body4" weight="medium" foreground="muted" numeric>
      {part.text}
    </Text>
  );
}
