export function retentionTone(daysLeft: number) {
  return daysLeft <= 7 ? "danger" : "hint";
}
