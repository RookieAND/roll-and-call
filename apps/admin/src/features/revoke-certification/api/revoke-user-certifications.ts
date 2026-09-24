"use server";

import { revalidatePath } from "next/cache";

import { requireStaff, revokeCertifications, type RevokeInput } from "@/shared/server";

export async function revokeUserCertifications(userId: string, input: RevokeInput) {
  const staff = await requireStaff();
  if (input.rulebooks.length === 0 || !input.userReason.trim()) {
    throw new Error("취소할 룰북을 고르고 사유를 입력해 주세요");
  }
  const result = await revokeCertifications(userId, staff.nickname, {
    ...input,
    userReason: input.userReason.trim(),
    staffMemo: input.staffMemo.trim(),
  });
  revalidatePath("/", "layout");
  return result;
}
