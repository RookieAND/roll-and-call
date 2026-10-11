import { isNil } from "es-toolkit";

import { RECRUIT_METHOD, type RecruitMethod } from "./recruit-method";

// 선발을 마치기 전. GM이 올리고 내리는 명단은 초안이고 [선발 마치기]가 승인이라, 이 동안은 아무에게도 알리지 않는다.
export function isSelectionDraft({
  recruitMethod,
  selectionFinishedAt,
}: {
  recruitMethod: RecruitMethod;
  selectionFinishedAt: Date | string | null;
}): boolean {
  return recruitMethod === RECRUIT_METHOD.selection && isNil(selectionFinishedAt);
}
