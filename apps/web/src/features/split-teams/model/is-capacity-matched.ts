import { GAME_VISIBILITY, type GameVisibility } from "@/entities/game";

// 지정 모집은 고른 사람만 참여하므로 정원이 고른 수와 같아야 열고, 일반 모집은 남는 자리를 공개 모집하므로 고른 수 이상이면 된다.
// 아무도 고르지 않으면 열지 않는다.
export function isCapacityMatched({
  capacity,
  selectedCount,
  visibility,
}: {
  capacity: number;
  selectedCount: number;
  visibility: GameVisibility;
}): boolean {
  if (selectedCount === 0) return false;
  return visibility === GAME_VISIBILITY.public
    ? capacity >= selectedCount
    : capacity === selectedCount;
}
