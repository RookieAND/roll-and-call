"use client";

import { createContext } from "react";

import type { MenuServer } from "./menu-server";

export interface ServerNav {
  current: MenuServer;
  servers: MenuServer[];
}

export const ServerNavContext = createContext<ServerNav | null>(null);
