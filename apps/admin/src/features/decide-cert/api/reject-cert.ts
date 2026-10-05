"use server";

import { revalidatePath } from "next/cache";

import { decideCert, getCurrentServer, requireStaff, type ShotKey } from "@/shared/server";

interface RejectCertInput {
  // 고른 반려 사유 이름. 기타면 null이고 userReason이 사유다.
  reasonTag: string | null;
  userReason: string;
  staffMemo: string;
  flaggedShots: ShotKey[];
}

export async function rejectCert(applicationId: string, input: RejectCertInput) {
  const staff = await requireStaff();
  if (!input.userReason.trim()) {
    throw new Error("사용자에게 보이는 사유를 입력해 주세요");
  }
  const server = await getCurrentServer();
  const result = await decideCert({
    serverId: server.id,
    id: applicationId,
    actor: staff,
    decision: {
      kind: "reject",
      ...input,
      userReason: input.userReason.trim(),
      staffMemo: input.staffMemo.trim(),
    },
  });
  revalidatePath("/", "layout");
  return result;
}
