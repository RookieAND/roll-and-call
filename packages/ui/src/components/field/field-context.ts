"use client";

import { createContext } from "react";

export interface FieldContextValue {
  messageId: string | undefined;
  invalid: boolean;
}

export const FieldContext = createContext<FieldContextValue | null>(null);
