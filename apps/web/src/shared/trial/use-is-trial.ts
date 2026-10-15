"use client";

import { isNull } from "es-toolkit";
import { use } from "react";

import { TrialContext } from "./trial-context";

export function useIsTrial() {
  return !isNull(use(TrialContext));
}
