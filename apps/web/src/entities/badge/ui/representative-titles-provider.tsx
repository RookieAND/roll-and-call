"use client";

import type { ReactNode } from "react";

import { RepresentativeTitlesContext } from "../model/representative-titles-context";
import type { RepresentativeTitle } from "../model/representative-title";

interface RepresentativeTitlesProviderProps {
  titles: Record<string, RepresentativeTitle>;
  children: ReactNode;
}

export function RepresentativeTitlesProvider({
  titles,
  children,
}: RepresentativeTitlesProviderProps) {
  return (
    <RepresentativeTitlesContext.Provider value={titles}>
      {children}
    </RepresentativeTitlesContext.Provider>
  );
}
