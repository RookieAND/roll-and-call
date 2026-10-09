import { RECRUIT_METHOD } from "@/entities/game";

import type { ActionGame } from "./game-action-view";

export function methodLines({
  game,
  drawCount,
}: {
  game: Pick<ActionGame, "recruitMethod" | "waitlistEnabled">;
  drawCount: number;
}): string[] {
  if (game.recruitMethod === RECRUIT_METHOD.selection) {
    return ["마감 뒤 GM이 직접 고릅니다.", "고르지 않은 신청자는 신청 순서대로 대기합니다."];
  }
  if (game.recruitMethod === RECRUIT_METHOD.lottery) {
    return [
      "정원과 관계없이 신청을 받습니다.",
      drawCount > 0
        ? `마감 때 추첨으로 ${drawCount}명을 정합니다.`
        : "정원이 이미 모두 확정되어 추첨할 자리가 없습니다.",
    ];
  }
  return [
    "신청한 순서대로 정원까지 바로 확정됩니다.",
    game.waitlistEnabled
      ? "정원이 차도 대기로 신청할 수 있습니다."
      : "정원이 차면 신청이 닫힙니다.",
  ];
}
