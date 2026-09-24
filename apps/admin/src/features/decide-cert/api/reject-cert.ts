"use server";

import { revalidatePath } from "next/cache";

import { decideCert, requireStaff, type ShotKey } from "@/shared/server";

interface RejectCertInput {
  reasonTag: string;
  userReason: string;
  staffMemo: string;
  flaggedShots: ShotKey[];
}

export async function rejectCert(applicationId: string, input: RejectCertInput) {
  const staff = await requireStaff();
  if (!input.reasonTag || !input.userReason.trim()) {
    throw new Error("사유를 고르고 사용자에게 보이는 사유를 입력해 주세요");
  }
  const result = await decideCert(applicationId, staff.nickname, {
    kind: "reject",
    ...input,
    userReason: input.userReason.trim(),
    staffMemo: input.staffMemo.trim(),
  });
  revalidatePath("/", "layout");
  return result;
}
