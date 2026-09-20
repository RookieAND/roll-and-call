import { Text } from "@trpg/ui";

import { heatColor } from "../model/heat-color";
import { heatLegend } from "../model/heat-legend";
import { heatTextColor } from "../model/heat-text-color";

export function HeatLegend({ capacity }: { capacity: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <Text typography="body4" foreground="muted" render={<span />}>
        겹침
      </Text>
      {heatLegend(capacity).map(({ count, step }) => (
        <span
          key={`${step}-${count}`}
          className="inline-flex size-5 items-center justify-center rounded-[4px] border border-gray-200 text-[12px] font-bold tabular-nums"
          style={{ backgroundColor: heatColor(step), color: heatTextColor(step) }}
        >
          {count}
        </span>
      ))}
      <span className="flex-1" />
      <Text typography="body4" foreground="hint" render={<span />}>
        정원 {capacity}명
      </Text>
    </div>
  );
}
