"use server";

import { revalidatePath } from "next/cache";

import { decideCert, getCurrentServer, requireStaff } from "@/shared/server";

export async function approveCert(applicationId: string) {
  const staff = await requireStaff();
  const server = await getCurrentServer();
  const result = await decideCert({
    serverId: server.id,
    id: applicationId,
    actor: staff,
    decision: { kind: "approve" },
  });
  revalidatePath("/", "layout");
  return result;
}
