export function demoteLine({
  beforeDraw,
  selectionOpen,
  waitingCount,
}: {
  beforeDraw: boolean;
  selectionOpen: boolean;
  waitingCount: number;
}): string {
  if (selectionOpen) return "신청자로 돌아갑니다.";
  if (beforeDraw) return "추첨 대상으로 돌아갑니다.";
  return `대기 ${waitingCount + 1}번이 됩니다.`;
}
