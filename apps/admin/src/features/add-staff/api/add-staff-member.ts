"use server";

import { revalidatePath } from "next/cache";

import { addStaff, requireStaff, type StaffRole } from "@/shared/server";

export async function addStaffMember(userId: string, role: StaffRole) {
  const staff = await requireStaff();
  if (staff.role !== "owner") throw new Error("소유자만 운영진을 추가할 수 있습니다");
  await addStaff(userId, role, staff);
  revalidatePath("/", "layout");
}
