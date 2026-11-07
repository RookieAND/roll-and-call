"use client";

import { createContext, type Dispatch, type SetStateAction } from "react";

export interface FeaturedPickValue {
  picked: string[];
  setPicked: Dispatch<SetStateAction<string[]>>;
}

export const FeaturedPickContext = createContext<FeaturedPickValue | null>(null);
