"use server";

import { updateHomebrewSummary } from "@roll-and-call/database/homebrew";
import { HOMEBREW_LIMIT } from "@roll-and-call/database/homebrew/model";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, notMemberError } from "@/shared/server";

import { HOMEBREW_ERROR } from "../model/homebrew-error";
import { HOMEBREW_FIELD } from "../model/homebrew-field";

const inputSchema = z.object({
  applicationId: idSchema,
  summary: z.string().max(HOMEBREW_LIMIT.summaryLength),
});

// 승인된 자작 룰의 한 줄 소개만 고친다. 이름·판본·자료는 고칠 수 없다.
export async function saveHomebrewSummary(
  input: z.input<typeof inputSchema>,
): Promise<ActionResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const summary = parsed.data.summary.trim();
  if (!summary) return { error: HOMEBREW_ERROR.summaryRequired, field: HOMEBREW_FIELD.summary };
  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };
  const { server, user } = member;
  const saved = await updateHomebrewSummary({
    serverId: server.id,
    userId: user.id,
    applicationId: parsed.data.applicationId,
    summary,
  });
  if (!saved) return { error: HOMEBREW_ERROR.summaryLocked };
  revalidatePath(serverPath({ slug: server.slug, path: "/me/rulebooks" }), "layout");
  return {};
}
