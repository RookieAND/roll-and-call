import { coordinatingScheduleText } from "./coordinating-schedule-text";
import { datedScheduleText } from "./dated-schedule-text";
import type { MultiRoundGame } from "./multi-round-game";
import { repeatScheduleText } from "./repeat-schedule-text";
import { repeatWindow } from "./repeat-window";
import { roundTotalLabel } from "./round-total-label";

// 여러 번 진행 구인의 카드 일정 줄. 한 번이면 null이다.
//   지정형 반복  「매주 토 오후 12:00~4:00 · 총 6회」
//   일시가 있는 그 밖의 경우 「10월 24일 (토) 오후 12:00부터 · 총 6회」
//   1회차 범위 조율 「일정 조율 · 총 6회」, 아직 미정 「일정 미정 · 총 6회」
export function multiRoundScheduleText(game: MultiRoundGame) {
  if (game.roundCount <= 1) return null;
  const { roundCount, confirmedAt } = game;
  if (!confirmedAt) {
    return game.rangeStart && game.rangeEnd
      ? coordinatingScheduleText(roundCount)
      : `일정 미정 · ${roundTotalLabel(roundCount)}`;
  }
  const repeat = repeatWindow(game);
  if (repeat) return repeatScheduleText({ ...repeat, roundCount });
  return datedScheduleText({ startsAt: confirmedAt, roundCount });
}
