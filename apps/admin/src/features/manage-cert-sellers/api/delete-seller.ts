"use server";

import { revalidatePath } from "next/cache";

import { idSchema, parseActionInput } from "@/shared/lib";
import { getCurrentServer, removeCertSeller, requireStaff } from "@/shared/server";

export async function deleteSeller(rawId: string) {
  const staff = await requireStaff();
  const id = parseActionInput(idSchema, rawId);
  const server = await getCurrentServer();
  await removeCertSeller({ serverId: server.id, id, actor: staff });
  revalidatePath("/", "layout");
}
