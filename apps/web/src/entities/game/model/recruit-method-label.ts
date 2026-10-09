import { RECRUIT_METHOD_LABEL } from "@roll-and-call/database/games/model";

import type { RecruitMethod } from "./recruit-method";

export function recruitMethodLabel(method: RecruitMethod) {
  return RECRUIT_METHOD_LABEL[method];
}
