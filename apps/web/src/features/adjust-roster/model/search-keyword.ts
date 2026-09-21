// 한글 입력기는 조합 중인 자모를 값에 먼저 넣는다("하" → "하ㄴ").
// 끝의 자모 하나는 아직 치는 중인 글자라 세지도, 찾지도 않는다.
const COMPOSING_JAMO = /[ㄱ-ㆎ]$/;

export function searchKeyword(query: string) {
  return query.trim().replace(COMPOSING_JAMO, "").trimEnd();
}
