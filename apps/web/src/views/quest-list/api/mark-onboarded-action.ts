"use server";

import { markOnboarded } from "@roll-and-call/database/profiles";

import type { ActionResult } from "@/shared/api";
import { getCurrentUser } from "@/shared/server";

// 퀘스트 목록에 들어온 순간 부른다. 계정이 온보딩(튜토리얼 퀘스트)을 마쳤다고 남겨, 서버 홈이 다시 퀘스트 목록으로 보내지 않게 한다.
export async function markOnboardedAction(): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "로그인이 필요합니다." };
  try {
    await markOnboarded(user.id);
  } catch (error) {
    console.error("markOnboarded failed:", error);
    return { error: "온보딩을 마치지 못했습니다.", failed: true };
  }
  return {};
}
