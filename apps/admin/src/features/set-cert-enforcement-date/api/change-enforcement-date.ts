"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { parseActionInput } from "@/shared/lib";
import {
  getCurrentServer,
  requireStaff,
  updateCertEnforcementDate,
  type EnforcementChange,
} from "@/shared/server";

const schema = z.object({
  date: z.date(),
  change: z.enum(["set", "postpone"]) satisfies z.ZodType<EnforcementChange>,
});

export async function changeEnforcementDate(dateArg: Date, changeArg: EnforcementChange) {
  const staff = await requireStaff();
  const { date, change } = parseActionInput(schema, { date: dateArg, change: changeArg });
  if (staff.role !== "owner") throw new Error("소유자만 적용일을 바꿀 수 있습니다");
  const server = await getCurrentServer();
  await updateCertEnforcementDate({ serverId: server.id, date, change, actor: staff });
  revalidatePath("/", "layout");
}
