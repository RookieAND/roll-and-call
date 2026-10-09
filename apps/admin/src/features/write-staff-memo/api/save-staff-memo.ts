"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { idSchema, parseActionInput } from "@/shared/lib";
import { addStaffMemo, getCurrentServer, requireStaff } from "@/shared/server";

const schema = z.object({ userId: idSchema, body: z.string().max(5000) });

export async function saveStaffMemo(args: { userId: string; body: string }) {
  const staff = await requireStaff();
  const { userId, body } = parseActionInput(schema, args);
  if (!body.trim()) return { ok: false as const, error: "메모를 입력해 주세요" };
  const server = await getCurrentServer();
  await addStaffMemo({ serverId: server.id, userId, actor: staff, body: body.trim() });
  revalidatePath("/", "layout");
  return { ok: true as const };
}
