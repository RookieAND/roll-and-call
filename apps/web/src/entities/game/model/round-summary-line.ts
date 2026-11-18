import type { MultiRoundGame } from "./multi-round-game";
import { repeatPhrase } from "./repeat-phrase";
import { repeatWindow } from "./repeat-window";
import { roundTotalLabel } from "./round-total-label";

// 회차 일정 시트와 신청 시트의 요약 한 줄. 「총 6회 · 매주 토 오후 12:00~4:00」 또는 「총 6회 · 회차마다 정합니다」
export function roundSummaryLine(game: MultiRoundGame) {
  const repeat = repeatWindow(game);
  const rhythm = repeat ? repeatPhrase(repeat) : "회차마다 정합니다";
  return `${roundTotalLabel(game.roundCount)} · ${rhythm}`;
}
