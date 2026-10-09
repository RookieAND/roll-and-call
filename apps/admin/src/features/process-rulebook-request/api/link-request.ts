"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { idSchema, parseActionInput } from "@/shared/lib";
import {
  getCurrentServer,
  linkRulebookRequest,
  requireStaff,
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
  revalidatePath("/", "layout");
  return result;
}
