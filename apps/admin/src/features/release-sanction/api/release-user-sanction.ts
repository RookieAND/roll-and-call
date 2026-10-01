"use server";

import { revalidatePath } from "next/cache";

import { getCurrentServer, releaseSanction, requireStaff } from "@/shared/server";

interface ReleaseUserSanctionInput {
  userReason: string;
  staffMemo: string;
}

export async function releaseUserSanction(userId: string, input: ReleaseUserSanctionInput) {
  const staff = await requireStaff();
  if (!input.userReason.trim()) throw new Error("해제 사유를 입력해 주세요");
  const server = await getCurrentServer();
  const result = await releaseSanction({
    serverId: server.id,
    userId,
    actor: staff,
    input: { userReason: input.userReason.trim(), staffMemo: input.staffMemo.trim() },
  });
  revalidatePath("/", "layout");
  return result;
}
