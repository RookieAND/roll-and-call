"use server";

import { saveMemberNickname } from "@roll-and-call/database/profiles";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { nicknameTakenMessage, USERNAME_MAX_LENGTH } from "@/entities/profile";
import type { ActionResult } from "@/shared/api";
import { safeNextPath, serverPath } from "@/shared/lib";
import { getActingMember, notMemberError } from "@/shared/server";

export async function saveWelcomeUsername({
  username,
  next,
}: {
  username: string;
  next: string;
}): Promise<ActionResult> {
  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };

  const nickname = username.trim();
  if (nickname.length < 1 || nickname.length > USERNAME_MAX_LENGTH) {
    return { error: `닉네임은 1~${USERNAME_MAX_LENGTH}자로 입력해 주세요.`, field: "username" };
  }

  const { server, user } = member;
  const saved = await saveMemberNickname({
    serverId: server.id,
    userId: user.id,
    nickname,
    keepSuffixNotice: false,
  });
  if (!saved.ok) return { error: nicknameTakenMessage(server.name), field: "username" };

  revalidatePath(serverPath({ slug: server.slug, path: "/me" }));
  redirect(
    safeNextPath({ value: next, fallback: serverPath({ slug: server.slug, path: "/games" }) }),
  );
}
