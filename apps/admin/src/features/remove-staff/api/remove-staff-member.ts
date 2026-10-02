"use server";

import { revalidatePath } from "next/cache";

import { getCurrentServer, removeStaff, requireOwner } from "@/shared/server";

interface RemoveStaffMemberInput {
  reason: string;
  notify: boolean;
}

export async function removeStaffMember(userId: string, input: RemoveStaffMemberInput) {
  const staff = await requireOwner();
  if (!input.reason.trim()) throw new Error("해제 사유를 입력해 주세요");
  const server = await getCurrentServer();
  await removeStaff({
    serverId: server.id,
    userId,
    actor: staff,
    reason: input.reason.trim(),
    notify: input.notify,
  });
  revalidatePath("/", "layout");
}
