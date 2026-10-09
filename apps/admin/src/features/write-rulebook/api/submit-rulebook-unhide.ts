"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { idSchema, parseActionInput } from "@/shared/lib";
import { getCurrentServer, requireStaff, unhideRulebook } from "@/shared/server";

const schema = z.object({ id: idSchema, reason: z.string().max(2000) });

export async function submitRulebookUnhide(idArg: string, reasonArg: string) {
  const staff = await requireStaff();
  const { id, reason } = parseActionInput(schema, { id: idArg, reason: reasonArg });
  if (!reason.trim()) throw new Error("변경 사유를 입력해 주세요");
  const server = await getCurrentServer();
  const result = await unhideRulebook({
    serverId: server.id,
    id,
    actor: staff,
    reason: reason.trim(),
  });
  revalidatePath("/", "layout");
  return result;
}
