export function deadlineLabel({ passed, daysLeft }: { passed: boolean; daysLeft: number }) {
  if (passed) return "마감됨";
  if (daysLeft === 0) return "오늘";
  return `D-${daysLeft}`;
}
