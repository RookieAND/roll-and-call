const NATIVE_DAYS = ["사흘", "나흘", "닷새", "엿새", "이레", "여드레", "아흐레", "열흘"] as const;

export function relativeDay(days: number): string | null {
  if (days < 0) return null;
  if (days === 0) return "오늘";
  if (days === 1) return "내일";
  if (days === 2) return "모레";
  const native = NATIVE_DAYS[days - 3];
  if (native) return `${native} 뒤`;
  return `D-${days}`;
}
