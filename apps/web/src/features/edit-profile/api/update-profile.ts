"use server";

import { saveMemberProfile } from "@roll-and-call/database/web";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { normalizeKeywords, normalizeLinks, type ProfileLink } from "@/entities/profile";
import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { getCurrentServer, getCurrentUser } from "@/shared/server";

import { BIO_MAX_LENGTH, PROFILE_FIELD, USERNAME_MAX_LENGTH } from "../model/profile-form";

export type UpdateProfileInput = {
  username: string;
  bio: string;
  keywords: string[];
  links: ProfileLink[];
};

export async function updateProfile(input: UpdateProfileInput): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const username = input.username.trim();
  if (username.length < 1 || username.length > USERNAME_MAX_LENGTH) {
    return {
      error: `닉네임은 1~${USERNAME_MAX_LENGTH}자로 입력하세요.`,
      field: PROFILE_FIELD.username,
    };
  }
  const bio = input.bio.trim();
  if (bio.length > BIO_MAX_LENGTH) {
    return {
      error: `한 줄 소개는 ${BIO_MAX_LENGTH}자 이내로 입력하세요.`,
      field: PROFILE_FIELD.bio,
    };
  }

  const server = await getCurrentServer();
  await saveMemberProfile({
    serverId: server.id,
    userId: user.id,
    username,
    bio: bio || null,
    keywords: normalizeKeywords(input.keywords),
    links: normalizeLinks(input.links),
  });

  revalidatePath("/me");
  redirect("/me");
}
