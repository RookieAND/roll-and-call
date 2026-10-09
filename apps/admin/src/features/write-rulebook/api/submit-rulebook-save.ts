"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { idSchema, parseActionInput } from "@/shared/lib";
import { getCurrentServer, requireStaff, updateRulebook } from "@/shared/server";

import type { RulebookDraft } from "../model/rulebook-draft";
import { rulebookDraftSchema } from "../model/rulebook-draft-schema";
import { toRulebookFields } from "../model/to-rulebook-fields";

const schema = z.object({ id: idSchema, draft: rulebookDraftSchema, reason: z.string().max(2000) });

export async function submitRulebookSave(id: string, draft: RulebookDraft, reason: string) {
  const staff = await requireStaff();
  const input = parseActionInput(schema, { id, draft, reason });
  const fields = toRulebookFields(input.draft);
  if (!fields.name || !input.reason.trim())
    throw new Error("룰북 이름과 변경 사유를 입력해 주세요");
  const server = await getCurrentServer();
  const result = await updateRulebook({
    serverId: server.id,
    id: input.id,
    fields,
    actor: staff,
    reason: input.reason.trim(),
  });
  revalidatePath("/", "layout");
  return result;
}
