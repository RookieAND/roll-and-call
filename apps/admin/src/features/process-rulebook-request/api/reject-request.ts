"use server";

import { revalidatePath } from "next/cache";

import { getCurrentServer, rejectRulebookRequest, requireStaff } from "@/shared/server";

import { REJECT_REASON_MAX_LENGTH } from "../model/reject-reason-max-length";

interface RejectRequestInput {
  userReason: string;
  staffMemo: string;
}

export async function rejectRequest(requestId: string, input: RejectRequestInput) {
  const staff = await requireStaff();
  const userReason = input.userReason.trim();
  if (!userReason || userReason.length > REJECT_REASON_MAX_LENGTH) {
    throw new Error("반려 사유를 200자 안으로 입력해 주세요");
  }
  const server = await getCurrentServer();
  const result = await rejectRulebookRequest({
    serverId: server.id,
    id: requestId,
    actor: staff,
    input: { userReason, staffMemo: input.staffMemo.trim() },
  });
  revalidatePath("/", "layout");
  return result;
}
