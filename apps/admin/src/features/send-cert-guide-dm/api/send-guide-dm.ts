"use server";

import { revalidatePath } from "next/cache";

import { requireStaff, sendCertGuideDm } from "@/shared/server";

export async function sendGuideDm(userId: string) {
  const staff = await requireStaff();
  const result = await sendCertGuideDm(userId, staff.nickname);
  revalidatePath("/cert/status");
  return result;
}
