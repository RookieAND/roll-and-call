import { z } from "zod";

import { idSchema } from "@/shared/api";

export const rosterMemberInputSchema = z.object({ gameId: idSchema, userId: idSchema });
