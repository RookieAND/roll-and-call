import { RULEBOOK_KIND } from "@roll-and-call/database/rulebooks/model";
import { z } from "zod";

import { idSchema } from "@/shared/lib";

import type { RulebookDraft } from "./rulebook-draft";

export const rulebookDraftSchema = z.object({
  name: z.string().max(200),
  edition: z.string().max(200),
  category: z.string().max(200),
  categoryAlias: z.string().max(200),
  kind: z.enum(RULEBOOK_KIND),
  supersedesId: idSchema.nullable(),
  aliasesText: z.string().max(2000),
  certRequired: z.boolean(),
}) satisfies z.ZodType<RulebookDraft>;
