import { z } from "zod";

import type { DiscordInteraction } from "./interaction-types";

const userSchema = z.looseObject({
  id: z.string(),
  username: z.string(),
  global_name: z.string().nullish(),
});

const attachmentSchema = z.looseObject({
  id: z.string(),
  filename: z.string(),
  content_type: z.string().optional(),
  size: z.number(),
  url: z.string(),
});

const modalFieldSchema = z.looseObject({
  custom_id: z.string(),
  value: z.union([z.string(), z.boolean()]).optional(),
  values: z.array(z.string()).optional(),
});

export const interactionSchema: z.ZodType<DiscordInteraction> = z.looseObject({
  type: z.number(),
  application_id: z.string().optional(),
  token: z.string().optional(),
  guild_id: z.string().optional(),
  data: z
    .looseObject({
      name: z.string().optional(),
      custom_id: z.string().optional(),
      options: z
        .array(
          z.looseObject({
            name: z.string(),
            value: z.union([z.string(), z.number(), z.boolean()]).optional(),
          }),
        )
        .optional(),
      components: z.array(z.looseObject({ component: modalFieldSchema })).optional(),
      resolved: z
        .looseObject({ attachments: z.record(z.string(), attachmentSchema).optional() })
        .optional(),
    })
    .optional(),
  member: z.looseObject({ nick: z.string().nullish(), user: userSchema }).optional(),
  user: userSchema.optional(),
});
