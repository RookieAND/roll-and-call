"use server";

import { saveMemberProfile } from "@roll-and-call/database/profiles";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  nicknameTakenMessage,
  linkError,
  normalizeKeywords,
  normalizeLinks,
  type ProfileLink,
} from "@/entities/profile";
import { type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, notMemberError } from "@/shared/server";

import { BIO_MAX_LENGTH, PROFILE_FIELD, USERNAME_MAX_LENGTH } from "../model/profile-form";

export type UpdateProfileInput = {
  username: string;
  bio: string;
  keywords: string[];
  links: ProfileLink[];
};

export async function updateProfile(input: UpdateProfileInput): Promise<ActionResult> {
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  const nickname = input.username.trim();
  if (nickname.length < 1 || nickname.length > USERNAME_MAX_LENGTH) {
    return {
      error: `닉네임은 1~${USERNAME_MAX_LENGTH}자로 입력해 주세요.`,
      field: PROFILE_FIELD.username,
    };
  }
  const bio = input.bio.trim();
  if (bio.length > BIO_MAX_LENGTH) {
    return {
      error: `한 줄 소개는 ${BIO_MAX_LENGTH}자 이내로 입력해 주세요.`,
      field: PROFILE_FIELD.bio,
    };
  }

  const invalidLink = input.links.map(linkError).find(Boolean);
  if (invalidLink) {
    return { error: invalidLink };
  }

  const saved = await saveMemberProfile({
    serverId: server.id,
    userId: user.id,
    nickname,
    bio: bio || null,
    keywords: normalizeKeywords(input.keywords),
    links: normalizeLinks(input.links),
  });
  if (!saved.ok) {
    return { error: nicknameTakenMessage(), field: PROFILE_FIELD.username };
  }

  const myPagePath = serverPath({ slug: server.slug, path: "/me" });
  revalidatePath(myPagePath);
  redirect(myPagePath);
}
