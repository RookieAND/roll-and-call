export const MEMBER_NICKNAME_MAX_LENGTH = 30;

// 앞뒤 공백을 지우고 연속 공백을 하나로 줄인 뒤 코드 포인트 기준 앞 30자. 비면 null.
export function nicknameBaseOf(raw: string | null | undefined): string | null {
  const normalized = (raw ?? "").trim().replace(/\s+/g, " ");
  const base = Array.from(normalized).slice(0, MEMBER_NICKNAME_MAX_LENGTH).join("");
  return base || null;
}

// 숫자를 붙여도 30자를 넘지 않게 바탕 이름을 자른다. n이 1이면 바탕 이름 그대로다.
export function suffixedNickname(base: string, n: number) {
  if (n === 1) return base;
  const suffix = String(n);
  const head = Array.from(base)
    .slice(0, MEMBER_NICKNAME_MAX_LENGTH - suffix.length)
    .join("");
  return `${head}${suffix}`;
}

// taken은 lower()한 닉네임 모음이다.
export function firstFreeNickname({ base, taken }: { base: string; taken: ReadonlySet<string> }) {
  for (let n = 1; ; n++) {
    const nickname = suffixedNickname(base, n);
    if (!taken.has(nickname.toLowerCase())) return { nickname, suffixed: n > 1 };
  }
}
