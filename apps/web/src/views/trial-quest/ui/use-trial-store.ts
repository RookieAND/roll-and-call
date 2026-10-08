"use client";

import { use } from "react";

import { TrialStoreContext } from "./trial-store-context";

export function useTrialStore() {
  const value = use(TrialStoreContext);
  if (!value) throw new Error("체험 저장소 밖에서 쓸 수 없습니다.");
  return value;
}
