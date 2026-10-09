"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { parseActionInput } from "@/shared/lib";
import { addCertSeller, getCurrentServer, requireStaff } from "@/shared/server";

export async function saveSeller(rawName: string) {
  const staff = await requireStaff();
  const name = parseActionInput(z.string().max(200), rawName);
  if (!name.trim()) return { ok: false as const, error: "판매처 이름을 입력해 주세요" };
  const server = await getCurrentServer();
  const result = await addCertSeller({ serverId: server.id, name: name.trim(), actor: staff });
  revalidatePath("/", "layout");
  return result;
}
