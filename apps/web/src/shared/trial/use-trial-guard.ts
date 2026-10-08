"use client";

import { use } from "react";

import { TrialContext } from "./trial-context";
import type { TrialHandlerKey } from "./trial-handler-key";

// 체험에서만 동작 앞에 확인 단계(시트 등)를 끼운다. 실제 화면에서는 바로 진행한다.
export function useTrialGuard(key: TrialHandlerKey): (proceed: () => void) => void {
  const runtime = use(TrialContext);
  return runtime?.guards[key] ?? ((proceed) => proceed());
}
