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
  // UI 키트의 진행바는 도메인을 모르므로 세 색만 있다. 신청이 막힌 full은 마감과 같은 회색.
  const barColor = status === "full" ? "closed" : status;

  return (
    <HStack gap={2} align="center">
      <Progress value={current} max={max} color={barColor} className="w-[52px]" />
      <GameSeatCount current={current} max={max} />
    </HStack>
  );
}
