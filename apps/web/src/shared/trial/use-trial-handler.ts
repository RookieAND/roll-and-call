"use client";

import { use } from "react";

import { TrialContext } from "./trial-context";
import type { TrialHandlerKey } from "./trial-handler-key";

// 체험 안이면 체험 저장소만 바꾸는 핸들러로, 아니면 실제 서버 액션을 그대로 돌려준다.
export function useTrialHandler<Action extends (...args: never[]) => Promise<unknown>>(
  key: TrialHandlerKey,
  action: Action,
): Action {
  const runtime = use(TrialContext);
  return (runtime?.handlers[key] as Action | undefined) ?? action;
}
