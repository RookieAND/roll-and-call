import { z } from "zod";

import type { RecentScreen } from "./recent-screen";

export const recentScreensSchema: z.ZodType<RecentScreen[]> = z.array(
  z.object({ href: z.string(), title: z.string(), visitedAt: z.number() }),
);
