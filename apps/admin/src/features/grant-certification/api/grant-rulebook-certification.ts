"use server";

import { revalidatePath } from "next/cache";

import { grantCertification, requireStaff } from "@/shared/server";

export async function grantRulebookCertification(
  rulebookId: string,
  userId: string,
  evidence: string,
) {
  const staff = await requireStaff();
  if (!evidence.trim()) throw new Error("인증 근거를 입력해 주세요");
  const result = await grantCertification(rulebookId, userId, staff, evidence.trim());
  revalidatePath("/", "layout");
  return result;
}
