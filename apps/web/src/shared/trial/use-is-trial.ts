"use client";

import { use } from "react";

import { TrialContext } from "./trial-context";

export function useIsTrial() {
  return use(TrialContext) !== null;
}
