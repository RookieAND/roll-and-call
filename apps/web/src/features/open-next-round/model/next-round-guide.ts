import { NEXT_ROUND_RANGE_MESSAGE } from "./next-round-rules";

// 일정 칸 아래 안내. 다 고르기 전에는 무엇을 고르면 열 수 있는지 함께 적는다.
export function nextRoundGuide({
  coordinate,
  ready,
}: {
  coordinate: boolean;
  ready: boolean;
}): string[] {
  if (coordinate) {
    return ready
      ? [NEXT_ROUND_RANGE_MESSAGE]
      : [NEXT_ROUND_RANGE_MESSAGE, "종료일을 고르면 회차를 열 수 있습니다."];
  }
  return ready ? [] : ["세션 일시를 고르면 회차를 열 수 있습니다."];
}
