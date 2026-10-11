"use server";

import { getMemberNickname } from "@roll-and-call/database/profiles";
import { validateReviewTemplate } from "@roll-and-call/database/servers/model";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { parseActionInput } from "@/shared/lib";
import { getCurrentServer, requireOwner, saveReviewTemplate } from "@/shared/server";

const saveTemplateSchema = z.object({
  title: z.string().max(2000),
  body: z.string().max(5000),
  expectedUpdatedAt: z.string().max(64).nullable(),
}) satisfies z.ZodType<SaveReviewTemplateInput>;

interface SaveReviewTemplateInput {
  title: string;
  body: string;
  // 편집을 시작할 때 읽은 저장 시각(ISO). 아직 저장된 적이 없으면 null.
  expectedUpdatedAt: string | null;
}

type SaveReviewTemplateResult =
  | { ok: true }
  | { ok: false; error: string }
  | { ok: false; conflict: { by: string; at: Date | null } };

export async function saveReviewTemplateAction(
  args: SaveReviewTemplateInput,
): Promise<SaveReviewTemplateResult> {
  const actor = await requireOwner();
  const { title, body, expectedUpdatedAt } = parseActionInput(saveTemplateSchema, args);
  const titleText = title.trim();
  const bodyText = body.trim();
  const error =
    validateReviewTemplate({ part: "title", text: titleText }) ??
    validateReviewTemplate({ part: "body", text: bodyText });
  if (error) return { ok: false, error };

  const server = await getCurrentServer();
  const result = await saveReviewTemplate({
    serverId: server.id,
    title: titleText,
    body: bodyText,
    expectedUpdatedAt: expectedUpdatedAt ? new Date(expectedUpdatedAt) : null,
    actor,
  });
  if (!result.ok) {
    const by = result.conflict.by
      ? await getMemberNickname({ serverId: server.id, userId: result.conflict.by })
      : null;
    revalidatePath("/", "layout");
    return { ok: false, conflict: { by: by ?? "다른 운영진", at: result.conflict.at } };
  }
  revalidatePath("/", "layout");
  return { ok: true };
}
