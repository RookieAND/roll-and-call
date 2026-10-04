"use server";

import { revalidatePath } from "next/cache";

import { getCurrentServer, releaseSanction, requireStaff } from "@/shared/server";

interface ReleaseUserSanctionInput {
  reason: string;
  staffMemo: string;
}

// 해제 사유는 활동 기록에만 남는다. 당사자 알림(sanction_released)은 releaseSanction이 같은 트랜잭션에서 넣는다.
export async function releaseUserSanction({
  userId,
  input,
}: {
  userId: string;
  input: ReleaseUserSanctionInput;
}) {
  const staff = await requireStaff();
  const reason = input.reason.trim();
  if (!reason) throw new Error("해제 사유를 골라 주세요");
  const server = await getCurrentServer();
  const result = await releaseSanction({
    serverId: server.id,
    userId,
    actor: staff,
    input: { userReason: reason, staffMemo: input.staffMemo.trim() },
  });
  revalidatePath("/", "layout");
  return result;
}
