"use client";

import { createContext, use, type ReactNode } from "react";

export interface CurrentServerSummary {
  slug: string;
  name: string;
  icon: string | null;
}

const CurrentServerContext = createContext<CurrentServerSummary | null>(null);

interface CurrentServerProviderProps {
  server: CurrentServerSummary;
  children: ReactNode;
}

export function CurrentServerProvider({ server, children }: CurrentServerProviderProps) {
  return <CurrentServerContext value={server}>{children}</CurrentServerContext>;
}

export function useCurrentServer() {
  const server = use(CurrentServerContext);
  if (!server) throw new Error("CurrentServerProvider 밖에서 useCurrentServer를 불렀습니다");
  return server;
}
