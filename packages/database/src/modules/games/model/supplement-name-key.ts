// 서플리먼트 이름을 비교할 때 쓰는 열쇠. 띄어쓰기와 대소문자가 달라도 같은 책으로 본다.
export function supplementNameKey(name: string) {
  return name.normalize("NFC").replaceAll(/\s+/g, "").toLowerCase();
}
