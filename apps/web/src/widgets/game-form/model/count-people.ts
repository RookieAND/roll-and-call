const NATIVE_COUNT = [
  "한",
  "두",
  "세",
  "네",
  "다섯",
  "여섯",
  "일곱",
  "여덟",
  "아홉",
  "열",
] as const;

// 시안 문장처럼 "두 사람"으로 센다. 열을 넘으면 숫자로 쓴다.
export function countPeople(count: number) {
  const native = NATIVE_COUNT[count - 1];
  return native ? `${native} 사람` : `${count}명`;
}
