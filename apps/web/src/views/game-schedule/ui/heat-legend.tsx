import { Text } from "@trpg/ui";
import { heatColor, heatLegend, heatTextColor } from "../model/heat-scale";

// 색 단계가 몇 명을 뜻하는지: 칸마다 숫자를 넣고, 오른쪽에 정원을 적는다.
export function HeatLegend({ capacity }: { capacity: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <Text typography="body4" foreground="muted" render={<span />}>
        겹침
      </Text>
      {heatLegend(capacity).map(({ count, step }) => (
        <span
          key={`${step}-${count}`}
          className="inline-flex size-5 items-center justify-center rounded-[4px] border border-gray-200 text-[10px] font-bold tabular-nums"
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
