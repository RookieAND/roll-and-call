import { HStack, Text } from "@trpg/ui";

import { heatColor } from "../model/heat-color";
import { heatLegend } from "../model/heat-legend";
import { heatTextColor } from "../model/heat-text-color";

export function HeatLegend({ capacity }: { capacity: number }) {
  return (
    <HStack align="center" gap="100">
      <Text typography="body4" foreground="hint" render={<span />}>
        겹침
      </Text>
      <HStack gap="025" className="flex-1">
        {heatLegend(capacity).map(({ count, step }) => (
          <span
            key={`${step}-${count}`}
            // 0단계는 바탕이 흰색이라 테두리가 없으면 칸이 사라진다.
            className="flex h-[18px] flex-1 items-center justify-center rounded-100 text-body5 font-bold tabular-nums data-[empty]:border data-[empty]:border-gray-200"
            data-empty={step === 0 ? "" : undefined}
            style={{ backgroundColor: heatColor(step), color: heatTextColor(step) }}
          >
            {count}
          </span>
        ))}
      </HStack>
      <Text typography="body4" foreground="hint" render={<span />}>
        정원 {capacity}명
      </Text>
    </HStack>
  );
}
