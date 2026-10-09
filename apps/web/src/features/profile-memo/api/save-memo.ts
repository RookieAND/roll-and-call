"use server";

import { deleteProfileMemo, saveProfileMemo } from "@roll-and-call/database/profiles";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, notMemberError } from "@/shared/server";

import { MEMO_MAX_LENGTH } from "../model/memo-form";

const saveMemoSchema = z.object({
  targetId: idSchema,
  body: z.string().max(MEMO_MAX_LENGTH * 10),
});

export async function saveMemo(input: z.input<typeof saveMemoSchema>): Promise<ActionResult> {
  const parsed = parseActionInput(saveMemoSchema, input);
  if (!parsed.ok) return parsed.result;
  const { targetId, body } = parsed.data;

  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;
  if (targetId === user.id) return { error: "자신에게는 메모를 쓸 수 없습니다." };

  const memo = body.trim().slice(0, MEMO_MAX_LENGTH);
  const memoKey = { serverId: server.id, ownerId: user.id, targetId };
  if (!memo) {
    await deleteProfileMemo(memoKey);
  } else {
    await saveProfileMemo({ ...memoKey, body: memo });
  }

  const profilePath = serverPath({ slug: server.slug, path: `/users/${targetId}` });
  revalidatePath(profilePath);
  redirect(profilePath);
}
