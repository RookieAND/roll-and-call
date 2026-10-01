"use server";

import { revalidatePath } from "next/cache";

import { getCurrentServer, removeCertSeller, requireStaff } from "@/shared/server";

export async function deleteSeller(id: string) {
  const staff = await requireStaff();
  const server = await getCurrentServer();
  await removeCertSeller({ serverId: server.id, id, actor: staff });
  revalidatePath("/", "layout");
}
