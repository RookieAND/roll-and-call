import {
  heatColor,
  heatTextColor,
  slotIso,
  type DayColumn,
  type TimeRow,
} from "@/shared/lib/slots";

type Props = {
  days: DayColumn[];
  timeRows: TimeRow[];
  counts: Record<string, number>;
  names: Record<string, string[]>;
  confirmedIso?: string | null;
};

export function Heatmap({ days, timeRows, counts, names, confirmedIso }: Props) {
  return (
    <div className="overflow-x-auto">
      <div
        className="grid min-w-full text-[9.5px]"
        style={{
          gridTemplateColumns: `40px repeat(${days.length}, minmax(0, 1fr))`,
        }}
      >
        <span />
        {days.map((d) => (
          <div key={d.date} className="flex flex-col items-center pb-1">
            <span className="text-[10.5px] text-gray-400">{d.dow}</span>
            <span className="text-[11.5px] font-bold text-gray-700">{d.md}</span>
          </div>
        ))}

        {timeRows.map((row) => {
          const showLabel = row.minute === 0;
          return [
            <span
              key={`${row.label}-t`}
              className="pr-1.5 text-right text-[9.5px] font-bold text-gray-400"
            >
              {showLabel ? row.label : ""}
            </span>,
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
    <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
      <span>겹침</span>
      {[0, 1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className="inline-block h-4 w-4 rounded-sm border border-gray-200"
          style={{ backgroundColor: heatColor(n) }}
        />
      ))}
    </div>
  );
}
