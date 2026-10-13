"use client";

import { createContext } from "react";

import type { MemberTitleSheet } from "./member-title-sheet";

export const MemberTitleSheetsContext = createContext<Record<string, MemberTitleSheet>>({});
