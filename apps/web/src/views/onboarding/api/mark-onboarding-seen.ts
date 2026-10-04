"use server";

import { markOnboarded } from "@roll-and-call/database/profiles";

import type { ActionResult } from "@/shared/api";
import { getCurrentUser } from "@/shared/server";

// 화면에 들어온 순간 본 것으로 친다. 비로그인은 남기지 않는다.
// 실패하면 다음에 서버 홈에 올 때 소개가 한 번 더 뜰 뿐이라 알리지 않는다.
export async function markOnboardingSeen(): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    if (user) await markOnboarded(user.id);
  } catch {
    // 위 주석대로 무시한다.
  }
  return {};
}
