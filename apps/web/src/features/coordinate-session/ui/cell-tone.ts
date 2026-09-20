// 미저장 칸은 선택 칸과 같은 바탕에 안쪽 두 겹 링으로 구분한다. 색을 흐리면 "덜 고른 칸"으로 읽힌다.
export const UNSAVED_SELECTED_TONE =
  "bg-primary-600 shadow-[inset_0_0_0_2px_var(--color-surface),inset_0_0_0_4px_var(--color-primary-300)]";

export function cellTone({ selected, saved }: { selected: boolean; saved: boolean }) {
  if (selected && saved) return "bg-primary-600";
  if (selected) return UNSAVED_SELECTED_TONE;
  // 저장돼 있었는데 방금 지운 칸. 저장을 누르기 전까지는 흔적을 남긴다.
  if (saved) return "bg-surface shadow-[inset_0_0_0_2px_var(--color-primary-300)]";
  return "cursor-pointer bg-surface hover:bg-primary-50";
}
