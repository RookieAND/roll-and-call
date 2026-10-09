"use server";

import type { RulebookKind } from "@roll-and-call/database";
import { RULEBOOK_KIND } from "@roll-and-call/database/rulebooks/model";
import { z } from "zod";

import { idSchema, parseActionInput } from "@/shared/lib";
import { getKindImpact, requireStaff } from "@/shared/server";

const schema = z.object({
  rulebookId: idSchema,
  nextKind: z.enum(RULEBOOK_KIND),
  query: z.string().max(200),
  cursor: z.string().max(20).nullable(),
});

export async function loadKindImpact(args: {
  rulebookId: string;
  nextKind: RulebookKind;
  query: string;
  cursor: string | null;
}) {
  await requireStaff();
  return getKindImpact(parseActionInput(schema, args));
}
