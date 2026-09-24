import { cva } from "class-variance-authority";

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

// 탭 이름 옆 숫자. 보통은 회색, 고른 탭은 옅은 인디고, 주의가 필요한 숫자는 옅은 빨강이다.
export function TabCount({ count, selected, danger = false }: TabCountProps) {
  const tone = danger ? "danger" : selected ? "on" : "off";
  return <span className={tabCount({ tone })}>{count}</span>;
}
