// 수정에서 공개 범위를 바꿀 수 없는 이유. 둘이 겹치면 세션 시작을 먼저 말한다. 바꿀 수 있으면 null이다.
export function visibilityLockReason({
  started,
  hasApplicants,
}: {
  started: boolean;
  hasApplicants: boolean;
}): string | null {
  if (started) return "세션이 시작되어 공개 범위를 바꿀 수 없습니다.";
  if (hasApplicants) return "신청자가 있어 공개 범위를 바꿀 수 없습니다.";
  return null;
}
