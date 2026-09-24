import { cva } from "class-variance-authority";

const cell = cva(
  "grid h-[40px] place-items-center rounded-200 text-body4 font-bold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-default",
  {
    variants: {
      strong: { true: "text-heat-ink-strong", false: "text-heat-ink" },
      selected: { true: "outline-2 outline-offset-1 outline-gray-900", false: "" },
    },
  },
);

interface HeatCellProps {
  label: string;
  count: number;
  level: number;
  selected: boolean;
  interactive: boolean;
  onSelect: () => void;
}

// ponytail: 히트맵 칸은 사용자 앱 HeatCell처럼 raw button이다. 프리미티브에 맞는 모양이 없다.
export function HeatCell({ label, count, level, selected, interactive, onSelect }: HeatCellProps) {
  const background = level ? `var(--color-heat-${level})` : "var(--color-gray-100)";
  return (
    <button
      type="button"
      aria-label={`${label} ${count}건`}
      aria-pressed={interactive ? selected : undefined}
      disabled={!interactive}
      onClick={onSelect}
      className={cell({ strong: level >= 4, selected })}
      style={{ background }}
    >
      {count || ""}
    </button>
  );
}
