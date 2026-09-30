"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

import {
  evaluateGameBadges,
  moderatePost,
  requireStaff,
  type PostModeration,
} from "@/shared/server";

import { REQUIRED_FIELD } from "../model/required-field";

export async function submitPostModeration(postId: string, moderation: PostModeration) {
  const staff = await requireStaff();
  const input = {
    action: moderation.action,
    userReason:
      REQUIRED_FIELD[moderation.action] === "userReason" ? moderation.userReason.trim() : "",
    staffMemo: moderation.staffMemo.trim(),
  };
  const requiredField = REQUIRED_FIELD[moderation.action];
  if (requiredField && !input[requiredField]) throw new Error("필수 칸을 채워 주세요");
  const result = await moderatePost(postId, staff, input);
  revalidatePath("/", "layout");
  // 숨긴 구인은 인정 세션에서 빠지고, 되돌리면 다시 들어간다.
  after(() => evaluateGameBadges(postId));
  return result;
}
