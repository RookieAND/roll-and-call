const SEOUL_OFFSET = 9 * 3_600_000;

// 요일(월=0) × 시간대(time-grid의 TIME_SLOTS 순서). 서울 시각으로 가른다.
export function gridCell(date: Date) {
  const seoul = new Date(date.getTime() + SEOUL_OFFSET);
  const day = (seoul.getUTCDay() + 6) % 7;
  const hour = seoul.getUTCHours();
  const slot =
    hour < 6
      ? 6
      : hour < 12
        ? 0
        : hour < 15
          ? 1
          : hour < 18
            ? 2
            : hour < 20
              ? 3
              : hour < 22
                ? 4
                : 5;
  return { day, slot };
}
