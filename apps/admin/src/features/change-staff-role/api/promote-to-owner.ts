"use server";

import { revalidatePath } from "next/cache";

import { changeStaffRole, getCurrentServer, requireStaff } from "@/shared/server";

export async function promoteToOwner(userId: string) {
  const staff = await requireStaff();
  if (staff.role !== "owner") throw new Error("소유자만 역할을 바꿀 수 있습니다");
  const server = await getCurrentServer();
  await changeStaffRole({ serverId: server.id, userId, role: "owner", actor: staff });
  revalidatePath("/", "layout");
}
