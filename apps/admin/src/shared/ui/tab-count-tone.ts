export function tabCountTone({ selected, danger }: { selected: boolean; danger: boolean }) {
  if (danger) return "danger";
  if (selected) return "on";
  return "off";
}
