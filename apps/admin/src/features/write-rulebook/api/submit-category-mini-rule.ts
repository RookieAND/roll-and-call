"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { idSchema, parseActionInput } from "@/shared/lib";
import { getCurrentServer, requireOwner, setCategoryMiniRule } from "@/shared/server";

const schema = z.object({ categoryId: idSchema, miniRule: z.boolean() });

export async function submitCategoryMiniRule(args: { categoryId: string; miniRule: boolean }) {
  const owner = await requireOwner();
  const { categoryId, miniRule } = parseActionInput(schema, args);
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
