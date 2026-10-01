"use server";

import { revalidatePath } from "next/cache";

import {
  getCurrentServer,
  linkRulebookRequest,
  requireStaff,
  type RulebookLinkInput,
} from "@/shared/server";

export async function linkRequest(requestId: string, input: RulebookLinkInput) {
  const staff = await requireStaff();
  const server = await getCurrentServer();
  const result = await linkRulebookRequest({
    serverId: server.id,
    id: requestId,
    actor: staff,
    input,
  });
  revalidatePath("/", "layout");
  return result;
}
