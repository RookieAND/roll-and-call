import { RECRUIT_METHOD, type RecruitMethod } from "./recruit-method";

export function recruitMethodLabel(method: RecruitMethod) {
  return method === RECRUIT_METHOD.lottery ? "추첨" : "선착순";
}
