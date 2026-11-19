// 「10월 24일 ~ 11월 6일」. 날짜 문자열(YYYY-MM-DD)을 그대로 읽어 시간대에 흔들리지 않는다.
export function coordinationRangeText({ start, end }: { start: string; end: string }) {
  const dayLabel = (value: string) => {
    const [, month, day] = value.split("-");
    return `${Number(month)}월 ${Number(day)}일`;
  };
  return `${dayLabel(start)} ~ ${dayLabel(end)}`;
}
