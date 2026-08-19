import { HStack, Progress } from "@trpg/ui";
import type { GameStatus } from "../model/status";
import { GameSeatCount } from "./game-seat-count";

// 정원 충족도 시각화: 진행바 + 인원 수. 상태색으로 진행바를 칠한다.
export function GameSeatProgress({
  current,
  max,
  status,
}: {
  current: number;
  max: number;
  status: GameStatus;
}) {
  return (
    <HStack gap={2} align="center">
      <Progress value={current} max={max} color={status} className="w-[52px]" />
      <GameSeatCount current={current} max={max} />
    </HStack>
  );
}
