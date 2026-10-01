"use server";

import { revalidatePath } from "next/cache";

import { addStaff, getCurrentServer, requireStaff, type StaffRole } from "@/shared/server";

export async function addStaffMember(userId: string, role: StaffRole) {
  const staff = await requireStaff();
  if (staff.role !== "owner") throw new Error("소유자만 운영진을 추가할 수 있습니다");
  const server = await getCurrentServer();
  await addStaff({ serverId: server.id, userId, role, actor: staff });
  revalidatePath("/", "layout");
}
