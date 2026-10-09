"use server";

import { saveMemberNickname } from "@roll-and-call/database/profiles";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { nicknameTakenMessage, USERNAME_MAX_LENGTH } from "@/entities/profile";
import { parseActionInput, type ActionResult } from "@/shared/api";
import { safeNextPath, serverPath } from "@/shared/lib";
import { getActingMember, getProfile, notMemberError } from "@/shared/server";

import { WELCOME_SAVE_MODE, type WelcomeSaveMode } from "../model/welcome-save-mode";

const NEXT_PATH_MAX_LENGTH = 2000;

const welcomeSchema = z.object({
  username: z.string().max(USERNAME_MAX_LENGTH * 10),
  next: z.string().max(NEXT_PATH_MAX_LENGTH),
  mode: z.enum(Object.values(WELCOME_SAVE_MODE)),
});

// [시작하기]와 [나중에 하기] 모두 칸 값을 저장한다. [나중에 하기]로 숫자 붙은 닉네임을 그대로 넘기면 서버 홈 안내가 이어서 보인다.
export async function saveWelcomeUsername(input: {
  username: string;
  next: string;
  mode: WelcomeSaveMode;
}): Promise<ActionResult> {
  const parsed = parseActionInput(welcomeSchema, input);
  if (!parsed.ok) return parsed.result;
  const { username, next, mode } = parsed.data;

  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };

  const nickname = username.trim();
  if (nickname.length < 1 || nickname.length > USERNAME_MAX_LENGTH) {
    return { error: `닉네임은 1~${USERNAME_MAX_LENGTH}자로 입력해 주세요.`, field: "username" };
  }

  const { server, user } = member;
  const profile = await getProfile(server.id, user.id);
  const saved = await saveMemberNickname({
    serverId: server.id,
    userId: user.id,
    nickname,
    keepSuffixNotice: mode === "later" && nickname === profile?.username,
  });
  if (!saved.ok) return { error: nicknameTakenMessage(), field: "username" };

  revalidatePath(serverPath({ slug: server.slug, path: "/" }), "layout");
  redirect(
    safeNextPath({ value: next, fallback: serverPath({ slug: server.slug, path: "/games" }) }),
  );
}
