"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { idSchema, parseActionInput } from "@/shared/lib";
import { getCurrentServer, removeStaff, requireOwner } from "@/shared/server";

const schema = z.object({ userId: idSchema, reason: z.string().max(2000) });

export async function removeStaffMember(userId: string, reason: string) {
  const staff = await requireOwner();
  const parsed = parseActionInput(schema, { userId, reason });
  const trimmed = parsed.reason.trim();
  if (!trimmed) throw new Error("해제 사유를 입력해 주세요");
  const server = await getCurrentServer();
  const result = await removeStaff({
    serverId: server.id,
    userId: parsed.userId,
    actor: staff,
    reason: trimmed,
  });
  revalidatePath("/", "layout");
  return result;
}
