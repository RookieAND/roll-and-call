"use server";

import { revalidatePath } from "next/cache";

import { changeStaffRole, requireStaff } from "@/shared/server";

export async function promoteToOwner(nickname: string) {
  const staff = await requireStaff();
  if (staff.role !== "owner") throw new Error("소유자만 역할을 바꿀 수 있습니다");
  await changeStaffRole(nickname, "owner", staff.nickname);
  revalidatePath("/", "layout");
}
