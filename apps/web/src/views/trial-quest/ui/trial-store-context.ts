"use client";

import { createContext, type Dispatch } from "react";

import type { TrialAction, TrialStore } from "../model/trial-store";

export interface TrialStoreValue {
  store: TrialStore;
  dispatch: Dispatch<TrialAction>;
}

export const TrialStoreContext = createContext<TrialStoreValue | null>(null);
