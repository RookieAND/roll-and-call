import "server-only";
import { isNull } from "es-toolkit";

import { getCurrentServer, getCurrentSessionUser } from "@/shared/server";

import { loadMySessions } from "./load-sessions";

export async function hasSessionTodo(): Promise<boolean> {
  const user = await getCurrentSessionUser();
  if (!user) return false;
  const server = await getCurrentServer();
  const { host, player } = await loadMySessions({ serverId: server.id, userId: user.id });
  return [...host, ...player].some((session) => !isNull(session.todo));
}
