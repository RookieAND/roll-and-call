"use client";

import { useContext } from "react";

import { RepresentativeTitlesContext } from "./representative-titles-context";
import type { RepresentativeTitle } from "./representative-title";

export function useRepresentativeTitle(userId: string): RepresentativeTitle | null {
  return useContext(RepresentativeTitlesContext)[userId] ?? null;
}
