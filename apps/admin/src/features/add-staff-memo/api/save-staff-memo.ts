"use server";

import { revalidatePath } from "next/cache";

import { addStaffMemo, requireStaff } from "@/shared/server";

export async function saveStaffMemo(userId: string, body: string) {
  const staff = await requireStaff();
  if (!body.trim()) throw new Error("메모를 입력해 주세요");
  await addStaffMemo(userId, staff.nickname, body.trim());
  revalidatePath("/", "layout");
}
