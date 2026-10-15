"use client";

import { createContext } from "react";

interface MobileDrawerContextValue {
  openDrawer: () => void;
  openServerSwitch: () => void;
}

export const MobileDrawerContext = createContext<MobileDrawerContextValue>({
  openDrawer: () => {},
  openServerSwitch: () => {},
});
