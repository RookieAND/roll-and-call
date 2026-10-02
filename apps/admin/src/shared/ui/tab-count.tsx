import { cva } from "class-variance-authority";

import { tabCountTone } from "./tab-count-tone";

const tabCount = cva(
  "inline-flex h-[20px] min-w-[20px] items-center justify-center rounded-full px-075 text-body4 leading-none font-bold tabular-nums",
  {
    variants: {
      tone: {
        off: "bg-(--rc-color-bg-secondary) text-(--rc-color-fg-muted)",
        on: "bg-(--rc-color-bg-primary-weakest) text-(--rc-color-fg-primary-strong)",
        danger: "bg-(--rc-color-bg-danger-weak) text-(--rc-color-fg-danger)",
      },
    },
  },
);

interface TabCountProps {
  count: number;
  selected: boolean;
  danger?: boolean;
}

export function TabCount({ count, selected, danger = false }: TabCountProps) {
  const tone = tabCountTone({ selected, danger });
  return <span className={tabCount({ tone })}>{count}</span>;
}
