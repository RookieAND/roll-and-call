export function remainingLabel(daysLeft: number) {
  if (daysLeft > 0) return `${daysLeft}일 남음`;
  if (daysLeft === 0) return "오늘 적용";
  return "적용 중";
}
