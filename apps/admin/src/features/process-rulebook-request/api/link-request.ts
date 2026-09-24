"use server";

import { revalidatePath } from "next/cache";

import { linkRulebookRequest, requireStaff, type RulebookLinkInput } from "@/shared/server";

export async function linkRequest(requestId: string, input: RulebookLinkInput) {
  const staff = await requireStaff();
  const result = await linkRulebookRequest(requestId, staff.nickname, input);
  revalidatePath("/", "layout");
  return result;
}
