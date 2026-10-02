"use server";

import { revalidatePath } from "next/cache";

import { addStaff, getCurrentServer, requireOwner } from "@/shared/server";

export async function addStaffMember(userId: string) {
  const staff = await requireOwner();
  const server = await getCurrentServer();
  await addStaff({ serverId: server.id, userId, role: "staff", actor: staff });
  revalidatePath("/", "layout");
}
