import { conflictToastText } from "@/shared/lib";

type HomebrewFailure =
  | { ok: false; conflict: { status: "approved" | "rejected" | "withdrawn"; by: string; at: Date } }
  | { ok: false; blocked: string };

// 실패한 처리 뒤 띄울 토스트. 거둔 신청은 새로 읽은 화면의 안내로 충분해서 null이다.
export function homebrewFailureText(failure: HomebrewFailure) {
  if ("blocked" in failure) return failure.blocked;
  if (failure.conflict.status === "withdrawn") return null;
  return conflictToastText({ conflict: failure.conflict, self: false, target: "신청" });
}
