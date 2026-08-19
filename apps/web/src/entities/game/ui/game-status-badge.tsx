import { Badge } from "@trpg/ui";
import {
  gameStatusColor,
  gameStatusLabel,
  type GameStatus,
} from "../model/status";

// 상태값 → 색/라벨 매핑을 한곳에 가둔 뱃지. 호출부가 두 맵을 직접 알 필요 없다.
export function GameStatusBadge({ status }: { status: GameStatus }) {
  return (
    <Badge color={gameStatusColor[status]}>{gameStatusLabel[status]}</Badge>
  );
}
