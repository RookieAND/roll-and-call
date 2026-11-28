import { isNull } from "es-toolkit";

import { RECRUIT_METHOD, type RecruitMethod } from "./recruit-method";

// GM이 시간을 정할 때 대기 인원의 다른 세션까지 볼지. 추첨 전 신청자는 추첨이 검사 없이 확정으로 올리므로 본다.
// 그 밖의 대기자는 승격·추가 때 겹침을 검사하므로 시간을 정하는 일을 막지 않는다.
export function checksWaitingSchedule(game: {
  recruitMethod: RecruitMethod;
  drawnAt: Date | null;
}): boolean {
  return game.recruitMethod === RECRUIT_METHOD.lottery && isNull(game.drawnAt);
}
