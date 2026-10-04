const RANK = { exact: 0, prefix: 1, partial: 2 } as const;

// ⌘K 유저 결과 순서: 정확히 같음 → 앞부분 일치 → 부분 일치. 대소문자를 무시하고, 안 맞으면 undefined다.
export function nicknameMatchRank({ nickname, keyword }: { nickname: string; keyword: string }) {
  const name = nickname.toLowerCase();
  const query = keyword.toLowerCase();
  if (name === query) return RANK.exact;
  if (name.startsWith(query)) return RANK.prefix;
  if (name.includes(query)) return RANK.partial;
  return undefined;
}
