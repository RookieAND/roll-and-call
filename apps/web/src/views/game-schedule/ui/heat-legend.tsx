import { HStack, Text } from "@trpg/ui";

import { heatColor } from "../model/heat-color";
import { heatLegend } from "../model/heat-legend";
import { heatTextColor } from "../model/heat-text-color";

export function HeatLegend({ capacity }: { capacity: number }) {
  return (
    <HStack align="center" gap="075">
      <Text typography="body4" foreground="muted" render={<span />}>
        겹침
      </Text>
      {heatLegend(capacity).map(({ count, step }) => (
        <span
          key={`${step}-${count}`}
          className="inline-flex size-5 items-center justify-center rounded-100 border border-gray-200 text-body5 font-bold tabular-nums"
          style={{ backgroundColor: heatColor(step), color: heatTextColor(step) }}
        >
          {count}
        </span>
      ))}
      <span className="flex-1" />
      <Text typography="body4" foreground="hint" render={<span />}>
        정원 {capacity}명
      </Text>
    </HStack>
  );
}
