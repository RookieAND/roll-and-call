"use client";

import type { ReactNode } from "react";

import type { MenuServer } from "./menu-server";
import { ServerNavContext } from "./server-nav-context";

interface ServerNavProviderProps {
  current: MenuServer;
  children: ReactNode;
}

// 서버 화면 헤더의 서버 배지가 읽는다. 서버 레이아웃이 한 번 읽어 내려 준다.
export function ServerNavProvider({ current, children }: ServerNavProviderProps) {
  return <ServerNavContext value={current}>{children}</ServerNavContext>;
}
