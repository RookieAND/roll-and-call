"use server";

import { revalidatePath } from "next/cache";

import { decideCert, requireStaff } from "@/shared/server";

export async function approveCert(applicationId: string) {
  const staff = await requireStaff();
  const result = await decideCert(applicationId, staff, { kind: "approve" });
  revalidatePath("/", "layout");
  return result;
}
