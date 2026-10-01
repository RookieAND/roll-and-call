const HUES = ["indigo", "green", "blue", "pink", "purple", "lime"] as const;

export function avatarColorFor(name: string): [string, string] {
  let hash = 0;
  for (let index = 0; index < name.length; index++) {
    hash = (hash * 31 + name.charCodeAt(index)) >>> 0;
  }
  const hue = HUES[hash % HUES.length]!;
  return [`var(--rc-color-data-${hue}-bg)`, `var(--rc-color-data-${hue}-ink)`];
}
