// 「16:00」 → 「오후 4:00」. 자정은 오전 12:00이다.
export function clockTextLabel(value: string) {
  const [hourText = "0", minute = "00"] = value.split(":");
  const hour = Number(hourText);
  const meridiem = hour < 12 ? "오전" : "오후";
  return `${meridiem} ${hour % 12 || 12}:${minute}`;
}
