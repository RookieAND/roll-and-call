import { HStack, Text } from "@roll-and-call/ui";

import { heatColor } from "../model/heat-color";
import { heatLegend } from "../model/heat-legend";
import { heatTextColor } from "../model/heat-text-color";

interface HeatLegendProps {
  capacity: number;
}

export function HeatLegend({ capacity }: HeatLegendProps) {
  return (
    <HStack align="center" gap="075">
      <Text typography="body4" foreground="hint" render={<span />}>
        겹침
      </Text>
      {heatLegend(capacity).map(({ count, step }) => (
        <span
          key={`${step}-${count}`}
          // 0단계는 바탕과 같은 색이라 테두리가 없으면 칸이 사라진다.
          className="flex h-5 w-6.5 items-center justify-center rounded-100 text-body5 font-bold tabular-nums data-[empty]:border data-[empty]:border-gray-200"
          data-empty={step === 0 ? "" : undefined}
          style={{ backgroundColor: heatColor(step), color: heatTextColor(step) }}
        >
          {count}
        </span>
      ))}
      <span className="flex-1" />
      <Text typography="body4" foreground="hint" render={<span />}>
        GM 포함 {capacity}명
      </Text>
    </HStack>
  );
}
