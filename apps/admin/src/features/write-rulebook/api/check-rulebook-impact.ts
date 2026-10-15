"use server";

import { z } from "zod";

import { getRulebookImpact } from "@/entities/rulebook/server";
import { idSchema, parseActionInput } from "@/shared/lib";
import { requireStaff } from "@/shared/server";

import { rulebookDraftSchema } from "../model/rulebook-draft-schema";

const schema = z.object({ id: idSchema, draft: rulebookDraftSchema });

export async function checkRulebookImpact(args: z.input<typeof schema>) {
  await requireStaff();
  const { id, draft } = parseActionInput(schema, args);
  return getRulebookImpact({
    rulebookId: id,
    supersedesId: draft.kind === "core" ? draft.supersedesId : null,
    certRequired: draft.certRequired,
  });
}
