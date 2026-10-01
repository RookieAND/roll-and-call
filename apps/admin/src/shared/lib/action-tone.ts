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
