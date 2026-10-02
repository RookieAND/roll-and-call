"use server";

import { saveMemberIntro } from "@roll-and-call/database/profiles";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { normalizeKeywords } from "@/entities/profile";
import type { ActionResult } from "@/shared/api";
import { safeNextPath, serverPath } from "@/shared/lib";
import { getActingMember, MEMBERSHIP_REQUIRED_MESSAGE } from "@/shared/server";

import { INTRO_BIO_MAX_LENGTH } from "../model/intro-bio-max-length";

export async function saveServerIntro({
  bio,
  keywords,
  next,
}: {
  bio: string;
  keywords: string[];
  next: string;
}): Promise<ActionResult> {
  const member = await getActingMember();
  if (!member) return { error: MEMBERSHIP_REQUIRED_MESSAGE };

  const trimmedBio = bio.trim();
  if (trimmedBio.length > INTRO_BIO_MAX_LENGTH) {
    return { error: `한 줄 소개는 ${INTRO_BIO_MAX_LENGTH}자 이내로 입력하세요.`, field: "bio" };
  }

  const { server, user } = member;
  await saveMemberIntro({
    serverId: server.id,
    userId: user.id,
    bio: trimmedBio || null,
    keywords: normalizeKeywords(keywords),
  });

  revalidatePath(serverPath({ slug: server.slug, path: "/me" }));
  redirect(
    safeNextPath({ value: next, fallback: serverPath({ slug: server.slug, path: "/games" }) }),
  );
}
