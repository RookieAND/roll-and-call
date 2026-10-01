"use server";

import { revalidatePath } from "next/cache";

import { getCurrentServer, hideRulebook, requireStaff } from "@/shared/server";

export async function submitRulebookHide(id: string, reason: string) {
  const staff = await requireStaff();
  if (!reason.trim()) throw new Error("변경 사유를 입력해 주세요");
  const server = await getCurrentServer();
  const result = await hideRulebook({
    serverId: server.id,
    id,
    actor: staff,
    reason: reason.trim(),
  });
  revalidatePath("/", "layout");
  return result;
}
