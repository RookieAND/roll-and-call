"use server";

import { getCurrentSessionUser } from "@/shared/server";

import { loadMySessions } from "./load-sessions";

// 하단 탭 마이페이지 빨간 점. 로그인 안 했으면 할 일도 없다.
export async function hasSessionTodo(): Promise<boolean> {
  const user = await getCurrentSessionUser();
  if (!user) return false;
  const { host, player } = await loadMySessions(user.id);
  return [...host, ...player].some((session) => session.todo !== null);
}
