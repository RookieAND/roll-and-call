import { Text } from "@trpg/ui";
import { HEAT_STEPS, heatColor } from "../model/heat-scale";

// 색 단계가 몇 명을 뜻하는지 보여주는 범례.
export function HeatLegend() {
  return (
    <Text
      typography="body4"
      foreground="muted"
      render={<div />}
      className="flex items-center gap-1.5"
    >
      <span>겹침</span>
      {HEAT_STEPS.map((n) => (
        <span
          key={n}
          className="inline-block h-4 w-4 rounded-sm border border-gray-200"
          style={{ backgroundColor: heatColor(n) }}
        />
      ))}
    </Text>
  );
}
