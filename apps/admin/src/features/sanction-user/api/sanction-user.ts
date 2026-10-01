"use server";

import { isNull } from "es-toolkit";
import { revalidatePath } from "next/cache";

import { applySanction, getCurrentServer, requireStaff, type SanctionInput } from "@/shared/server";

export async function sanctionUser(userId: string, input: SanctionInput) {
  const staff = await requireStaff();
  const validDays = isNull(input.days) || (Number.isInteger(input.days) && input.days > 0);
  if (!validDays || !input.userReason.trim()) {
    throw new Error("기간과 사용자에게 보여줄 사유를 확인해 주세요");
  }
  const server = await getCurrentServer();
  const result = await applySanction({
    serverId: server.id,
    userId,
    actor: staff,
    input: {
      ...input,
      userReason: input.userReason.trim(),
      staffMemo: input.staffMemo.trim(),
    },
  });
  revalidatePath("/", "layout");
  return result;
}
