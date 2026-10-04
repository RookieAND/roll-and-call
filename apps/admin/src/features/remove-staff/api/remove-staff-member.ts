"use server";

import { revalidatePath } from "next/cache";

import { getCurrentServer, removeStaff, requireOwner } from "@/shared/server";

export async function removeStaffMember(userId: string, reason: string) {
  const staff = await requireOwner();
  const trimmed = reason.trim();
  if (!trimmed) throw new Error("해제 사유를 입력해 주세요");
  const server = await getCurrentServer();
  const result = await removeStaff({ serverId: server.id, userId, actor: staff, reason: trimmed });
  revalidatePath("/", "layout");
  return result;
}
