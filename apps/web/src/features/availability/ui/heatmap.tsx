import { slotIso, type DayColumn, type TimeRow } from "@/shared/lib/slots";

type Props = {
  days: DayColumn[];
  timeRows: TimeRow[];
  counts: Record<string, number>;
  names: Record<string, string[]>;
  maxCount: number;
};

export function Heatmap({ days, timeRows, counts, names, maxCount }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-xs">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-white" />
            {days.map((d) => (
              <th
                key={d.date}
                className="whitespace-nowrap px-1 font-medium text-gray-600"
              >
                {d.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeRows.map((row) => (
            <tr key={row.label}>
              <td className="sticky left-0 z-10 whitespace-nowrap bg-white pr-2 text-right text-gray-400">
                {row.minute === 0 ? row.label : ""}
              </td>
              {days.map((d) => {
                const key = slotIso(d.date, row.hour, row.minute);
                const count = counts[key] ?? 0;
                const intensity =
                  maxCount > 0 && count > 0 ? 0.15 + (0.85 * count) / maxCount : 0;
                return (
                  <td
                    key={key}
                    title={names[key]?.join(", ")}
                    className="h-6 w-10 border border-gray-200 text-center text-[10px] text-gray-700"
                    style={
                      intensity > 0
                        ? { backgroundColor: `rgba(34, 197, 94, ${intensity})` }
                        : undefined
                    }
                  >
                    {count > 0 ? count : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
