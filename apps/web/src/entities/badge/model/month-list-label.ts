// 받은 달 목록(최근 먼저). 같은 해는 월만, 해가 바뀌면 다시 연도를 붙인다: 「2026년 9월 · 6월 · 2025년 12월」.
export function monthListLabel(months: string[]): string {
  return months
    .map((month, index) => {
      const [year, monthNumber] = month.split("-");
      const sameYear = index > 0 && months[index - 1]!.startsWith(`${year}-`);
      return sameYear ? `${Number(monthNumber)}월` : `${year}년 ${Number(monthNumber)}월`;
    })
    .join(" · ");
}
