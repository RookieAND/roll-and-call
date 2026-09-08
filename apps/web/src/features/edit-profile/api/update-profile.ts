"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { SLOT_KEYS } from "@/entities/profile";
import { db, profiles, getCurrentUser } from "@/shared/server";
import type { ActionResult } from "@/shared/api";
export type UpdateProfileInput = {
  username: string;
  bio: string;
  defaultSlots: string[];
};

export async function updateProfile(input: UpdateProfileInput): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const name = input.username.trim();
  if (name.length < 1 || name.length > 30) {
    return { error: "닉네임은 1~30자로 입력하세요.", field: "username" };
  }
  const bio = input.bio.trim();
  if (bio.length > 200) {
    return { error: "한 줄 소개는 200자 이내로 입력하세요.", field: "bio" };
  }
  const defaultSlots = input.defaultSlots.filter((s) => SLOT_KEYS.includes(s));

  await db
    .update(profiles)
    .set({ username: name, bio: bio || null, defaultSlots })
    .where(eq(profiles.id, user.id));

  revalidatePath("/me");
  return { redirect: "/me" };
}
