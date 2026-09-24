"use server";

import { revalidatePath } from "next/cache";

import { rejectRulebookRequest, requireStaff } from "@/shared/server";

interface RejectRequestInput {
  userReason: string;
  staffMemo: string;
}

export async function rejectRequest(requestId: string, input: RejectRequestInput) {
  const staff = await requireStaff();
  if (!input.userReason.trim()) throw new Error("반려 사유를 입력해 주세요");
  const result = await rejectRulebookRequest(requestId, staff, {
    userReason: input.userReason.trim(),
    staffMemo: input.staffMemo.trim(),
  });
  revalidatePath("/", "layout");
  return result;
}
