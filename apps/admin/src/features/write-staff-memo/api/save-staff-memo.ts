"use server";

import { revalidatePath } from "next/cache";

import { addStaffMemo, getCurrentServer, requireStaff } from "@/shared/server";

export async function saveStaffMemo({ userId, body }: { userId: string; body: string }) {
  const staff = await requireStaff();
  if (!body.trim()) throw new Error("메모를 입력해 주세요");
  const server = await getCurrentServer();
  await addStaffMemo({ serverId: server.id, userId, actor: staff, body: body.trim() });
  revalidatePath("/", "layout");
  return { ok: true as const };
}
