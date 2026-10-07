// 일정 칸 아래 안내. 조율형은 고를 일정이 없어 안내도 없다.
export function nextRoundGuide({
  coordinate,
  ready,
}: {
  coordinate: boolean;
  ready: boolean;
}): string[] {
  return coordinate || ready ? [] : ["세션 일시를 고르면 회차를 열 수 있습니다."];
}
