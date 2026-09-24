"use server";

import { revalidatePath } from "next/cache";

import { approveRulebookRequest, requireStaff } from "@/shared/server";

export async function approveRequest(requestId: string) {
  const staff = await requireStaff();
  const result = await approveRulebookRequest(requestId, staff.nickname);
  revalidatePath("/", "layout");
  return result;
}
