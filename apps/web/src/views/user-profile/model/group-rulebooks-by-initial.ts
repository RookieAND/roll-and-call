const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const SYLLABLES_PER_INITIAL = 588;
// 쌍자음은 같은 칸으로 묶는다.
const INITIALS = "ㄱㄱㄴㄷㄷㄹㅁㅂㅂㅅㅅㅇㅈㅈㅊㅋㅌㅍㅎ";
const OTHER_GROUP = "기타";

export interface RulebookGroup<Item> {
  label: string;
  items: Item[];
}

export function initialOf(label: string): string {
  const first = label.trim().charAt(0);
  const code = first.charCodeAt(0);
  if (code >= HANGUL_START && code <= HANGUL_END) {
    return INITIALS[Math.floor((code - HANGUL_START) / SYLLABLES_PER_INITIAL)]!;
  }
  if (/[A-Za-z]/.test(first)) return first.toUpperCase();
  return OTHER_GROUP;
}

function rank(label: string): number {
  if (label === OTHER_GROUP) return 2;
  return /^[A-Z]$/.test(label) ? 1 : 0;
}

// 한글 초성(ㄱ~ㅎ) → 알파벳(A~Z) → 기타 순으로 묶고, 묶음 안은 가나다순이다.
export function groupRulebooksByInitial<Item extends { label: string }>(
  items: readonly Item[],
): RulebookGroup<Item>[] {
  const groups = new Map<string, Item[]>();
  for (const item of items.toSorted((left, right) => left.label.localeCompare(right.label, "ko"))) {
    const initial = initialOf(item.label);
    groups.set(initial, [...(groups.get(initial) ?? []), item]);
  }
  return [...groups.entries()]
    .map(([label, grouped]) => ({ label, items: grouped }))
    .toSorted(
      (left, right) =>
        rank(left.label) - rank(right.label) || left.label.localeCompare(right.label, "ko"),
    );
}
