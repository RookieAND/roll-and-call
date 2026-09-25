// 시안의 태그 색: 인정·되돌리는 조치는 초록, 불리한 조치는 빨강, 불참 취소는 파랑.
export function actionTone(action: string) {
  if (action === "불참 취소") return "primary";
  if (action.includes("승인") || action === "직접 인증" || action.includes("해제")) {
    return "success";
  }
  if (action.includes("반려") || action.includes("제재") || action.includes("취소")) {
    return "danger";
  }
  return "gray";
}
