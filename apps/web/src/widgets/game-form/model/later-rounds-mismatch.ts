import { ROUND_SCHEDULE_ERROR_MESSAGE } from "@roll-and-call/database/games/model";

import { GAME_KIND, ROUND_MODE, ROUND_REPEAT, ROUND_SCHEDULE_KIND } from "@/entities/game";
import type { GameFormValues } from "@/features/write-game";

// 직접 입력한 행 수가 예정 회차 수 - 1과 다를 때의 안내. 제출 버튼 위 warning Callout이 쓴다.
export function laterRoundsMismatchMessage({
  kind,
  roundMode,
  roundCount,
  roundScheduleKind,
  roundRepeat,
  laterRounds = [],
}: Pick<
  GameFormValues,
  "kind" | "roundMode" | "roundCount" | "roundScheduleKind" | "roundRepeat" | "laterRounds"
>) {
  const isCustomDesignated =
    roundMode === ROUND_MODE.multi &&
    kind !== GAME_KIND.briefing &&
    roundScheduleKind !== ROUND_SCHEDULE_KIND.coordinated &&
    roundRepeat === ROUND_REPEAT.custom;
  const isMismatch = roundCount !== undefined && laterRounds.length !== roundCount - 1;
  return isCustomDesignated && isMismatch ? ROUND_SCHEDULE_ERROR_MESSAGE.COUNT_MISMATCH : undefined;
}
