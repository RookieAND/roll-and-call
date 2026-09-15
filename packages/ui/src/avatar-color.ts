const palette: readonly [string, string][] = [
  ["#E0E7FF", "#4338CA"],
  ["#FFE7D6", "#B4531B"],
  ["#DDF3E8", "#0B7A55"],
  ["#EDE2FB", "#6B3FA0"],
  ["#FBE2EC", "#A03F6B"],
  ["#E2F0FB", "#2C6BA0"],
];

export function avatarColorFor(name: string): [string, string] {
  let hash = 0;
  for (let index = 0; index < name.length; index++) {
    hash = (hash * 31 + name.charCodeAt(index)) >>> 0;
  }
  return palette[hash % palette.length]!;
}
