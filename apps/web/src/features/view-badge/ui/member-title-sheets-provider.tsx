"use client";

import type { ReactNode } from "react";

import type { MemberTitleSheet } from "../model/member-title-sheet";
import { MemberTitleSheetsContext } from "../model/member-title-sheets-context";

interface MemberTitleSheetsProviderProps {
  sheets: Record<string, MemberTitleSheet>;
  children: ReactNode;
}

export function MemberTitleSheetsProvider({ sheets, children }: MemberTitleSheetsProviderProps) {
  return (
    <MemberTitleSheetsContext.Provider value={sheets}>{children}</MemberTitleSheetsContext.Provider>
  );
}
