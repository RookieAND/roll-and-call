"use server";

import { revalidatePath } from "next/cache";

import { addCertSeller, getCurrentServer, requireStaff } from "@/shared/server";

export async function saveSeller(name: string) {
  const staff = await requireStaff();
  if (!name.trim()) throw new Error("판매처 이름을 입력해 주세요");
  const server = await getCurrentServer();
  const result = await addCertSeller({ serverId: server.id, name: name.trim(), actor: staff });
  revalidatePath("/", "layout");
  return result;
}
