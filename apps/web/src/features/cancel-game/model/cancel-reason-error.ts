export const CANCEL_REASON_MAX_LENGTH = 200;

// 사유는 구인 상세와 구인 스레드에 그대로 보인다(D281).
export function cancelReasonError(reason: string): string | null {
  const trimmed = reason.trim();
  if (trimmed.length === 0) return "취소 사유를 입력해 주세요.";
  if (trimmed.length > CANCEL_REASON_MAX_LENGTH) return "취소 사유는 200자까지 쓸 수 있습니다.";
  return null;
}
