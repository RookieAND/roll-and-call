"use client";

import { createContext, type ReactNode } from "react";

import type { TrialHandlerKey } from "./trial-handler-key";

type TrialHandler = (...args: never[]) => Promise<unknown>;
type TrialGuard = (proceed: () => void) => void;

// 구인 등록 위저드를 체험용으로 줄이는 설정. stepIndexes는 실제 단계 번호(0부터) 가운데 보일 것이고, hints는 보이는 단계 순서대로 붙는 안내 문구다.
export interface TrialWizard {
  stepIndexes: readonly number[];
  total: number;
  hints: Record<number, readonly string[]>;
  // 위저드 머리 바로 아래에 붙는 줄. 「체험 중」 표시가 쓴다.
  banner?: ReactNode;
}

export interface TrialRuntime {
  wizard?: TrialWizard;
  handlers: Partial<Record<TrialHandlerKey, TrialHandler>>;
  guards: Partial<Record<TrialHandlerKey, TrialGuard>>;
  // 실제 화면이 router.push로 보내는 곳을 체험 안의 이동으로 바꾼다.
  navigate: (href: string) => void;
}

// 체험 환경 안에서만 값이 있다. 값이 없으면 실제 화면이므로 기능 컴포넌트는 원래 동작을 그대로 쓴다.
export const TrialContext = createContext<TrialRuntime | null>(null);
