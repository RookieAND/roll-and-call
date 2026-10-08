"use server";

import { markOnboarded } from "@roll-and-call/database/profiles";

import type { ActionResult } from "@/shared/api";
import { getCurrentUser } from "@/shared/server";

// 퀘스트 목록의 [온보딩 마치기]. 계정이 소개를 마쳤다고 남겨, 서버 홈이 다시 퀘스트 목록으로 보내지 않게 한다.
export async function finishOnboardingAction(): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "로그인이 필요합니다." };
  try {
    await markOnboarded(user.id);
  } catch (error) {
    console.error("markOnboarded failed:", error);
    return { error: "온보딩을 마치지 못했습니다." };
  }
  return {};
}
