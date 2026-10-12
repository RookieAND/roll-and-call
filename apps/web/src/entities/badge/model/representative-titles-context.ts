"use client";

import { createContext } from "react";

import type { RepresentativeTitle } from "./representative-title";

export const RepresentativeTitlesContext = createContext<Record<string, RepresentativeTitle>>({});
