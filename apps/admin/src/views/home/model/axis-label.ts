import type { WeeklyPoint } from "@/shared/server";

interface AxisLabelOptions {
  weeks: WeeklyPoint[];
  index: number;
  currentLabel: string;
}

// 마지막 칸은 최근 7일의 짧은 날짜 범위, 나머지는 「9월 1주」처럼 달이 바뀔 때만 달을 쓴다.
export function axisLabel({ weeks, index, currentLabel }: AxisLabelOptions) {
  if (index === weeks.length - 1) return currentLabel;
  const [month, week] = (weeks[index]?.label ?? "").replace("주차", "주").split(" ");
  const previousMonth = weeks[index - 1]?.label.split(" ")[0];
  return month === previousMonth ? week : `${month} ${week}`;
}
