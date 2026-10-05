"use server";

import { revalidatePath } from "next/cache";

import { getCurrentServer, requireOwner, setCategoryMiniRule } from "@/shared/server";

export async function submitCategoryMiniRule({
  categoryId,
  miniRule,
}: {
  categoryId: string;
  miniRule: boolean;
}) {
  const owner = await requireOwner();
  const server = await getCurrentServer();
  const result = await setCategoryMiniRule({
    serverId: server.id,
    categoryId,
    miniRule,
    actor: owner,
  });
  revalidatePath("/", "layout");
  return result;
}
