"use client";

import { useMemo, useReducer, type ReactNode } from "react";

import { EMPTY_TRIAL_STORE, trialReducer } from "../model/trial-store";
import { TrialStoreContext } from "./trial-store-context";

interface TrialStoreProviderProps {
  children: ReactNode;
}

// 체험 경로(/onboarding) 레이아웃에 한 번 둔다. 퀘스트를 오가도 유지되고 새로고침하면 비워진다.
export function TrialStoreProvider({ children }: TrialStoreProviderProps) {
  const [store, dispatch] = useReducer(trialReducer, EMPTY_TRIAL_STORE);
  const value = useMemo(() => ({ store, dispatch }), [store]);
  return <TrialStoreContext value={value}>{children}</TrialStoreContext>;
}
