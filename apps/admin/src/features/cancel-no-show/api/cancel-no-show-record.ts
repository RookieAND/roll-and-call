"use server";

import { revalidatePath } from "next/cache";

import { cancelNoShow, requireStaff } from "@/shared/server";

export async function cancelNoShowRecord(noShowId: string, reason: string) {
  const staff = await requireStaff();
  if (!reason.trim()) throw new Error("취소 사유를 입력해 주세요");
  const result = await cancelNoShow(noShowId, staff, reason);
  revalidatePath("/", "layout");
  return result;
}
