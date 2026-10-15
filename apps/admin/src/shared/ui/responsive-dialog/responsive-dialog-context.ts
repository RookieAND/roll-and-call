"use client";

import { createContext } from "react";

// 데스크톱이면 Dialog, 아니면 아래에서 올라오는 Sheet로 그린다.
export const ResponsiveDialogContext = createContext(true);
