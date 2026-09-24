"use server";

import { revalidatePath } from "next/cache";

import { releaseSanction, requireStaff } from "@/shared/server";

interface ReleaseUserSanctionInput {
  userReason: string;
  staffMemo: string;
}

export async function releaseUserSanction(userId: string, input: ReleaseUserSanctionInput) {
  const staff = await requireStaff();
  if (!input.userReason.trim()) throw new Error("해제 사유를 입력해 주세요");
  const result = await releaseSanction(userId, staff.nickname, {
    userReason: input.userReason.trim(),
    staffMemo: input.staffMemo.trim(),
  });
  revalidatePath("/", "layout");
  return result;
}
