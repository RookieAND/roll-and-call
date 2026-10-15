// 확정 버튼이 막힌 이유. 먼저 채울 칸부터 알린다.
export function grantBlockedReason({
  bookCount,
  userCount,
  evidence,
}: {
  bookCount: number;
  userCount: number;
  evidence: string;
}) {
  if (bookCount === 0) return "룰북을 1권 이상 골라 주세요";
  if (userCount === 0) return "인증할 유저를 골라 주세요";
  if (!evidence.trim()) return "부여 사유를 입력해야 확정할 수 있습니다";
  return null;
}
