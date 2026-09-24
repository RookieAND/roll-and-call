"use server";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { db, getCurrentUser, rulebookRequests } from "@/shared/server";

import { rulebookRequestSchema, type RulebookRequestValues } from "../model/rulebook-request-form";

export async function requestRulebook(input: RulebookRequestValues): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };
  const parsed = rulebookRequestSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "입력을 확인해 주세요." };

  const { name, edition, publisher, note } = parsed.data;
  await db
    .insert(rulebookRequests)
    .values({ userId: user.id, name, edition, publisher: publisher || null, note });
  return {};
}
