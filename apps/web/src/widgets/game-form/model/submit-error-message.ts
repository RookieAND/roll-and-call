import type { ActionResult } from "@/shared/api";

const HOMEBREW_UNAVAILABLE_MESSAGE = "이 룰은 지금 사용할 수 없습니다.\n다른 룰을 골라 주세요.";

// 자작 룰은 인증이 없어 룰 칸 실패는 곧 그 룰을 더 쓸 수 없게 된 것(비공개 전환·삭제)이다.
export function submitErrorMessage({
  result,
  homebrew,
}: {
  result: ActionResult;
  homebrew: boolean;
}) {
  if (homebrew && result.field === "rule") return HOMEBREW_UNAVAILABLE_MESSAGE;
  return result.error;
}
