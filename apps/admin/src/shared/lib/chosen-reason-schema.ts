import type { ChosenReason } from "@roll-and-call/database/moderation/model";
import { z } from "zod";

export const chosenReasonSchema = z.object({
  code: z.string().max(100),
  text: z.string().max(1000).nullable(),
}) satisfies z.ZodType<ChosenReason>;
