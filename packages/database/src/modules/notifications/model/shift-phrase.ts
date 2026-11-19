const DAY_MS = 86_400_000;

// 「한 주씩 뒤로」「2일씩 앞으로」. 이후 회차를 같은 간격으로 함께 옮겼을 때의 말.
export function shiftPhrase(shiftMs: number) {
  const direction = shiftMs >= 0 ? "뒤로" : "앞으로";
  const days = Math.round(Math.abs(shiftMs) / DAY_MS);
  if (days > 0 && days % 7 === 0) {
    const weeks = days / 7;
    return `${weeks === 1 ? "한" : weeks} 주씩 ${direction}`;
  }
  return `${days}일씩 ${direction}`;
}
