// 검증 실패한 첫 필드로 스크롤. id는 Field의 htmlFor와 같다.
export function scrollToField(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
}
