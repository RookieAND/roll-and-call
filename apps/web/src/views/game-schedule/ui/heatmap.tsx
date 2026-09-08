import { Text } from "@trpg/ui";
import { slotIso, type DayColumn, type TimeRow } from "@/shared/lib";
// Overlap heat palette (0→5+) — 시안 uses saturation steps, not a green ramp.
const HEAT_LIGHT = ["#FFFFFF", "#EDEEFC", "#D8DAFA", "#B7BAF5", "#8E92EF", "#5B60E4"] as const;

function heatColor(count: number): string {
  return HEAT_LIGHT[Math.min(5, Math.max(0, count))]!;
}

// Count label reads white once the cell is dark enough, else the deep indigo.
function heatTextColor(count: number): string {
  return count >= 3 ? "#FFFFFF" : "#5B60E4";
}

type Props = {
  days: DayColumn[];
  timeRows: TimeRow[];
  counts: Record<string, number>;
  names: Record<string, string[]>;
  confirmedAt?: Date | null;
};

export function Heatmap({ days, timeRows, counts, names, confirmedAt }: Props) {
  const confirmedIso = confirmedAt?.toISOString() ?? null;
  return (
    <div className="overflow-x-auto">
      <div
        className="grid min-w-full text-xs"
        style={{
          gridTemplateColumns: `40px repeat(${days.length}, minmax(0, 1fr))`,
        }}
      >
        <span />
        {days.map((d) => (
          <div key={d.date} className="flex flex-col items-center pb-1">
            <Text typography="body4" foreground="hint" render={<span />}>
              {d.dow}
            </Text>
            <Text typography="subtitle2" render={<span />}>
              {d.md}
            </Text>
          </div>
        ))}

        {timeRows.map((row) => {
          const showLabel = row.minute === 0;
          return [
            <Text
              key={`${row.label}-t`}
              typography="subtitle2"
              foreground="hint"
              render={<span />}
              className="pr-1.5 text-right"
            >
              {showLabel ? row.label : ""}
            </Text>,
            ...days.map((d) => {
              const key = slotIso(d.date, row.hour, row.minute);
              const count = counts[key] ?? 0;
              const isConfirmed = confirmedIso === key;
              return (
                <div
                  key={key}
                  title={names[key]?.join(", ")}
                  className="flex h-[22px] items-center justify-center border-b border-l border-b-[#F1F1F5] border-l-[#EFEFF3] font-bold"
                  style={{
                    backgroundColor: heatColor(count),
                    color: heatTextColor(count),
                    outline: isConfirmed ? "2px solid #0B9C6C" : undefined,
                    outlineOffset: isConfirmed ? "-2px" : undefined,
                  }}
                >
                  {count > 0 ? count : ""}
                </div>
              );
            }),
          ];
        })}
      </div>
    </div>
  );
}

export function HeatLegend() {
  return (
    <Text
      typography="body4"
      foreground="muted"
      render={<div />}
      className="flex items-center gap-1.5"
    >
      <span>겹침</span>
      {[0, 1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className="inline-block h-4 w-4 rounded-sm border border-gray-200"
          style={{ backgroundColor: heatColor(n) }}
        />
      ))}
    </Text>
  );
}
