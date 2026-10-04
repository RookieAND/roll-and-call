import type { StatusTone } from "./status-tone";

const SUCCESS_WORDS = ["승인", "직접 인증", "해제"] as const;
const DANGER_WORDS = ["반려", "제재", "취소"] as const;

// 조치 뱃지 색: 「불참 취소」 파랑, 승인·직접 인증·해제 초록, 반려·제재·취소 빨강, 나머지 회색.
export function actionTone(action: string): StatusTone {
  if (action === "불참 취소") return "primary";
  if (SUCCESS_WORDS.some((word) => action.includes(word))) return "success";
  if (DANGER_WORDS.some((word) => action.includes(word))) return "danger";
  return "gray";
}
