"use server";

import { revalidatePath } from "next/cache";

import { idSchema, parseActionInput } from "@/shared/lib";
import { addStaff, getCurrentServer, requireOwner } from "@/shared/server";

export async function addStaffMember(candidateId: string) {
  const staff = await requireOwner();
  const userId = parseActionInput(idSchema, candidateId);
  const server = await getCurrentServer();
  const result = await addStaff({ serverId: server.id, userId, role: "staff", actor: staff });
  revalidatePath("/", "layout");
  return result;
}
