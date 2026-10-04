import { formatDate } from "@/shared/lib";

// 그래프 가로축의 마지막 칸(최근 7일). 좁아서 연도·같은 달은 줄인다: 「24~30일」, 달이 바뀌면 「28일~4일」.
export function shortDayRange(from: Date, to: Date) {
  const [, startMonth, startDay] = formatDate(from).split(" ");
  const [, endMonth, endDay] = formatDate(to).split(" ");
  if (startMonth === endMonth) return `${startDay!.replace("일", "")}~${endDay}`;
  return `${startDay}~${endDay}`;
}
