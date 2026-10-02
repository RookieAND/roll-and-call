// 조치 종류 뱃지는 회색이 기본이고, 되돌릴 수 없거나 사용자를 제한하는 조치만 빨간색이다(시안 s4.jsx ACT_DANGER).
const DANGER_ACTIONS: readonly string[] = [
  "제재",
  "추방",
  "반려로 돌림",
  "구인 제거",
  "후기 제거",
  "운영진 해제",
  "인증 반려",
];

export function actionTone(action: string) {
  return DANGER_ACTIONS.includes(action) ? "danger" : "gray";
}
