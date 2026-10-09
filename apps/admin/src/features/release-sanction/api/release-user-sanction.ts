"use server";

import {
  parseReason,
  USER_ACTION_REASON,
  type ChosenReason,
} from "@roll-and-call/database/moderation/model";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { chosenReasonSchema, idSchema, parseActionInput } from "@/shared/lib";
import { getCurrentServer, releaseSanction, requireStaff } from "@/shared/server";

interface ReleaseUserSanctionInput {
  reason: ChosenReason | null;
  staffMemo: string;
}

const schema = z.object({
  userId: idSchema,
  input: z.object({
    reason: chosenReasonSchema.nullable(),
    staffMemo: z.string().max(5000),
  }) satisfies z.ZodType<ReleaseUserSanctionInput>,
});

// 해제 사유는 활동 기록에만 남는다. 당사자 알림(sanction_released)은 releaseSanction이 같은 트랜잭션에서 넣는다.
export async function releaseUserSanction({
  userId,
  input,
}: {
  userId: string;
  input: ReleaseUserSanctionInput;
}) {
  const staff = await requireStaff();
  const parsed = parseActionInput(schema, { userId, input });
  const reason = parseReason({ reason: parsed.input.reason, reasons: USER_ACTION_REASON });
  const server = await getCurrentServer();
  const result = await releaseSanction({
    serverId: server.id,
    userId: parsed.userId,
    actor: staff,
    input: { reason, staffMemo: parsed.input.staffMemo.trim() },
  });
  revalidatePath("/", "layout");
  return result;
}
