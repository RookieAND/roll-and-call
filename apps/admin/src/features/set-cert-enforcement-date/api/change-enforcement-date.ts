"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { parseActionInput } from "@/shared/lib";
import {
  getCurrentServer,
  requireOwner,
  updateCertEnforcementDate,
  type EnforcementChange,
} from "@/shared/server";

const schema = z.object({
  date: z.date(),
  change: z.enum(["set", "postpone"]) satisfies z.ZodType<EnforcementChange>,
});

export async function changeEnforcementDate(dateArg: Date, changeArg: EnforcementChange) {
  const staff = await requireOwner();
  const { date, change } = parseActionInput(schema, { date: dateArg, change: changeArg });
  const server = await getCurrentServer();
  await updateCertEnforcementDate({ serverId: server.id, date, change, actor: staff });
  revalidatePath("/", "layout");
  return { ok: true as const };
}
