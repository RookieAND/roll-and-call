import { isNil } from "es-toolkit";

import { RECRUIT_METHOD, type RecruitMethod } from "./recruit-method";

// 추첨 글인데 아직 추첨 전이다. 세션 시간을 정하거나 가능 시간을 칠할 수 없다(R10, R11).
export function isAwaitingDraw({
  recruitMethod,
  drawnAt,
}: {
  recruitMethod: RecruitMethod;
  drawnAt: Date | string | null;
}): boolean {
  return recruitMethod === RECRUIT_METHOD.lottery && isNil(drawnAt);
}
