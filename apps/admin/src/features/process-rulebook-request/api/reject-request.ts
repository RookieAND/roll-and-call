"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { idSchema, parseActionInput } from "@/shared/lib";
import { getCurrentServer, rejectRulebookRequest, requireStaff } from "@/shared/server";

import { REJECT_REASON_MAX_LENGTH } from "../model/reject-reason-max-length";

interface RejectRequestInput {
  userReason: string;
  staffMemo: string;
}

const schema = z.object({
  requestId: idSchema,
  input: z.object({
    userReason: z.string().max(2000),
    staffMemo: z.string().max(5000),
  }) satisfies z.ZodType<RejectRequestInput>,
});

export async function rejectRequest(requestId: string, input: RejectRequestInput) {
  const staff = await requireStaff();
  const parsed = parseActionInput(schema, { requestId, input });
  const userReason = parsed.input.userReason.trim();
  if (!userReason || userReason.length > REJECT_REASON_MAX_LENGTH) {
    throw new Error("반려 사유를 200자 안으로 입력해 주세요");
  }
  const server = await getCurrentServer();
  const result = await rejectRulebookRequest({
    serverId: server.id,
    id: parsed.requestId,
    actor: staff,
    input: { userReason, staffMemo: parsed.input.staffMemo.trim() },
  });
  revalidatePath("/", "layout");
  return result;
}
