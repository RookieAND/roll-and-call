const HUES = ["indigo", "green", "blue", "pink", "purple", "lime"] as const;

// 닉네임을 해시해 색을 고른다. 상태를 뜻하지 않는다(초록 아바타 ≠ 확정).
export function avatarColorFor(name: string): [string, string] {
  let hash = 0;
  for (let index = 0; index < name.length; index++) {
    hash = (hash * 31 + name.charCodeAt(index)) >>> 0;
  }
  const hue = HUES[hash % HUES.length]!;
  return [`var(--rc-color-data-${hue}-bg)`, `var(--rc-color-data-${hue}-ink)`];
}
