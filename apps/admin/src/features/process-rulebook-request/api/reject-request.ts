"use server";

import { revalidatePath } from "next/cache";

import { getCurrentServer, rejectRulebookRequest, requireStaff } from "@/shared/server";

interface RejectRequestInput {
  userReason: string;
  staffMemo: string;
}

export async function rejectRequest(requestId: string, input: RejectRequestInput) {
  const staff = await requireStaff();
  if (!input.userReason.trim()) throw new Error("반려 사유를 입력해 주세요");
  const server = await getCurrentServer();
  const result = await rejectRulebookRequest({
    serverId: server.id,
    id: requestId,
    actor: staff,
    input: { userReason: input.userReason.trim(), staffMemo: input.staffMemo.trim() },
  });
  revalidatePath("/", "layout");
  return result;
}
