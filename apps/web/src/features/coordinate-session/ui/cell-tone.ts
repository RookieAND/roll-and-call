export const UNSAVED_SELECTED_TONE = "bg-primary-300 shadow-[inset_0_0_0_2px_var(--color-surface)]";

export function cellTone({ selected, saved }: { selected: boolean; saved: boolean }) {
  if (selected && saved) return "bg-primary-600";
  if (selected) return UNSAVED_SELECTED_TONE;
  if (saved) return "bg-surface shadow-[inset_0_0_0_2px_var(--color-primary-300)]";
  return "cursor-pointer bg-surface hover:bg-primary-50";
}
