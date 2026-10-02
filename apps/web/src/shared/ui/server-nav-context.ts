"use client";

import { createContext } from "react";

import type { MenuServer } from "./menu-server";

export const ServerNavContext = createContext<MenuServer | null>(null);
