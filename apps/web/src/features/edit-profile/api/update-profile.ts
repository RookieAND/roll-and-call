"use server";

import { saveMemberProfile } from "@roll-and-call/database/profiles";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  KEYWORD_MAX_COUNT,
  KEYWORD_MAX_LENGTH,
  LINK_MAX_COUNT,
  nicknameTakenMessage,
  linkError,
  normalizeKeywords,
  normalizeLinks,
  type ProfileLink,
} from "@/entities/profile";
import { parseActionInput, type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, notMemberError } from "@/shared/server";

import { BIO_MAX_LENGTH, PROFILE_FIELD, USERNAME_MAX_LENGTH } from "../model/profile-form";

export type UpdateProfileInput = {
  username: string;
  bio: string;
  keywords: string[];
  links: ProfileLink[];
};

const LINK_VALUE_INPUT_MAX_LENGTH = 1000;

const updateProfileSchema = z.object({
  username: z.string().max(USERNAME_MAX_LENGTH * 10),
  bio: z.string().max(BIO_MAX_LENGTH * 10),
  keywords: z.array(z.string().max(KEYWORD_MAX_LENGTH * 10)).max(KEYWORD_MAX_COUNT * 10),
  links: z
    .array(
      z.object({
        service: z.string().max(50),
        value: z.string().max(LINK_VALUE_INPUT_MAX_LENGTH),
      }),
    )
    .max(LINK_MAX_COUNT * 2),
});

export async function updateProfile(input: UpdateProfileInput): Promise<ActionResult> {
  const parsed = parseActionInput(updateProfileSchema, input);
  if (!parsed.ok) return parsed.result;
  const values = parsed.data;

  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  const nickname = values.username.trim();
  if (nickname.length < 1 || nickname.length > USERNAME_MAX_LENGTH) {
    return {
      error: `닉네임은 1~${USERNAME_MAX_LENGTH}자로 입력해 주세요.`,
      field: PROFILE_FIELD.username,
    };
  }
  const bio = values.bio.trim();
  if (bio.length > BIO_MAX_LENGTH) {
    return {
      error: `한 줄 소개는 ${BIO_MAX_LENGTH}자 이내로 입력해 주세요.`,
      field: PROFILE_FIELD.bio,
    };
  }

  const invalidLink = values.links.map(linkError).find(Boolean);
  if (invalidLink) {
    return { error: invalidLink };
  }

  const saved = await saveMemberProfile({
    serverId: server.id,
    userId: user.id,
    nickname,
    bio: bio || null,
    keywords: normalizeKeywords(values.keywords),
    links: normalizeLinks(values.links),
  });
  if (!saved.ok) {
    return { error: nicknameTakenMessage(), field: PROFILE_FIELD.username };
  }

  const myPagePath = serverPath({ slug: server.slug, path: "/me" });
  revalidatePath(myPagePath);
  redirect(myPagePath);
}
