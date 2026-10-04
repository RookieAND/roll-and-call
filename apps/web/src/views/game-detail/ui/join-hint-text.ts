import { formatDate } from "@/shared/lib";

export function joinHintText({
  isFull,
  isLottery,
  waitingCount,
  endDate,
}: {
  isFull: boolean;
  isLottery: boolean;
  waitingCount: number;
  endDate: Date;
}) {
  if (isLottery) return `${formatDate(endDate)} 마감 때 추첨합니다.`;
  if (isFull) return `지금 신청하면 대기 ${waitingCount + 1}번입니다.`;
  return "지금 신청하면 바로 확정됩니다.";
}
