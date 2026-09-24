"use server";

import { revalidatePath } from "next/cache";

import { applySanction, requireStaff, type SanctionInput } from "@/shared/server";

export async function sanctionUser(userId: string, input: SanctionInput) {
  const staff = await requireStaff();
  const validDays = input.days === null || (Number.isInteger(input.days) && input.days > 0);
  if (!validDays || !input.userReason.trim()) {
    throw new Error("기간과 사용자에게 보여줄 사유를 확인해 주세요");
  }
  const result = await applySanction(userId, staff.nickname, {
    ...input,
    userReason: input.userReason.trim(),
    staffMemo: input.staffMemo.trim(),
  });
  revalidatePath("/", "layout");
  return result;
}
