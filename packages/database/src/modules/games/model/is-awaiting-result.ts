import { isNil } from "es-toolkit";

import { RECRUIT_METHOD, type RecruitMethod } from "./recruit-method";

// 신청자만 있고 결과가 아직 없다. 추첨은 추첨 전, 선발은 선발을 마치기 전이며 이때 waiting 행은 대기자가 아니라 신청자다.
export function isAwaitingResult({
  recruitMethod,
  drawnAt,
  selectionFinishedAt,
}: {
  recruitMethod: RecruitMethod;
  drawnAt: Date | string | null;
  selectionFinishedAt: Date | string | null;
}): boolean {
  switch (recruitMethod) {
    case RECRUIT_METHOD.firstCome:
      return false;
    case RECRUIT_METHOD.lottery:
      return isNil(drawnAt);
    case RECRUIT_METHOD.selection:
      return isNil(selectionFinishedAt);
    default:
      return recruitMethod satisfies never;
  }
}

// 결과(추첨·선발) 전에 할 수 없는 일을 안내할 때 쓰는 앞말.
export const AWAITING_RESULT_PHRASE = {
  lottery: "추첨 뒤에",
  selection: "선발을 마친 뒤에",
} as const satisfies Record<Exclude<RecruitMethod, "first_come">, string>;

export type AwaitingResultMethod = keyof typeof AWAITING_RESULT_PHRASE;

// 결과 전이면 어느 방식인지, 아니면 null.
export function awaitingResultMethod(game: {
  recruitMethod: RecruitMethod;
  drawnAt: Date | string | null;
  selectionFinishedAt: Date | string | null;
}): AwaitingResultMethod | null {
  return isAwaitingResult(game) ? (game.recruitMethod as AwaitingResultMethod) : null;
}
