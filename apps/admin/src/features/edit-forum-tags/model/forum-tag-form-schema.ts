import { z } from "zod";

import type { ForumTagForm } from "./forum-tag-form";

const tagId = z.string().max(64);

export const forumTagFormSchema = z.object({
  open: tagId,
  closed: tagId,
  cancelled: tagId,
  categories: z
    .record(z.string().max(100), tagId)
    .refine((categories) => Object.keys(categories).length <= 100),
  playTypes: z.object({ voice: tagId, text: tagId }),
  briefing: tagId,
  session: tagId,
}) satisfies z.ZodType<ForumTagForm>;
