// id는 Field의 htmlFor와 같다.
export function scrollToField(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
}
