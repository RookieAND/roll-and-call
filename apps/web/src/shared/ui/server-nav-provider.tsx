"use client";

import type { ReactNode } from "react";

import type { MenuServer } from "./menu-server";
import { ServerNavContext } from "./server-nav-context";

interface ServerNavProviderProps {
  current: MenuServer;
  servers: MenuServer[];
  children: ReactNode;
}

// 서버 화면 헤더의 서버 전환이 읽는다. 서버 레이아웃이 한 번 읽어 내려 준다.
export function ServerNavProvider({ current, servers, children }: ServerNavProviderProps) {
  return <ServerNavContext value={{ current, servers }}>{children}</ServerNavContext>;
}
