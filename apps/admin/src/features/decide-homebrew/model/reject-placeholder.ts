export function rejectPlaceholder({ reason, other }: { reason: string | null; other: boolean }) {
  if (!reason) return "사유를 먼저 골라 주세요";
  return other ? "신청자에게 보일 사유를 적어 주세요" : undefined;
}
