import "server-only";
import { isNull } from "es-toolkit";

import { getCurrentSessionUser } from "@/shared/server";

import { loadMySessions } from "./load-sessions";

export async function hasSessionTodo(): Promise<boolean> {
  const user = await getCurrentSessionUser();
  if (!user) return false;
  const { host, player } = await loadMySessions(user.id);
  return [...host, ...player].some((session) => !isNull(session.todo));
}
