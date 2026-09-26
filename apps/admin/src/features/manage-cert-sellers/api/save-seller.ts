"use server";

import { revalidatePath } from "next/cache";

import { addCertSeller, requireStaff } from "@/shared/server";

export async function saveSeller(name: string) {
  const staff = await requireStaff();
  if (!name.trim()) throw new Error("판매처 이름을 입력해 주세요");
  const result = await addCertSeller(name.trim(), staff);
  revalidatePath("/", "layout");
  return result;
}
