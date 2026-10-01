export function actionTriggerLabel(selected: string[]) {
  if (selected.length === 0) return "모든 조치";
  if (selected.length === 1) return selected[0];
  return `조치 ${selected.length}개`;
}
