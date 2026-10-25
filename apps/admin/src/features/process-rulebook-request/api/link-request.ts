"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";

import { idSchema, parseActionInput } from "@/shared/lib";
import {
  getCurrentServer,
  linkRulebookRequest,
  requireStaff,
  syncRulebookRequestStaffNotice,
  type RulebookLinkInput,
} from "@/shared/server";

const schema = z.object({
  requestId: idSchema,
  input: z.object({
    rulebookId: idSchema,
    addAlias: z.boolean(),
  }) satisfies z.ZodType<RulebookLinkInput>,
});

export async function linkRequest(requestId: string, input: RulebookLinkInput) {
  const staff = await requireStaff();
  const parsed = parseActionInput(schema, { requestId, input });
  const server = await getCurrentServer();
  const result = await linkRulebookRequest({
    serverId: server.id,
    id: parsed.requestId,
    actor: staff,
    input: parsed.input,
  });
  if (result.ok) {
    after(() => syncRulebookRequestStaffNotice({ server, requestId: parsed.requestId }));
  }
  revalidatePath("/", "layout");
  return result;
}
