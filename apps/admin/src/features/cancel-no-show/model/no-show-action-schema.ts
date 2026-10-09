import { z } from "zod";

import { idSchema } from "@/shared/lib";

const isNoShowId = (value: string) => {
  const [gameId, userId, ...rest] = value.split("_");
  return (
    rest.length === 0 && idSchema.safeParse(gameId).success && idSchema.safeParse(userId).success
  );
};

export const noShowActionSchema = z.object({
  noShowId: z.string().max(80).refine(isNoShowId),
  reason: z.string().max(2000),
});
