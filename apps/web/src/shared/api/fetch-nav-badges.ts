import { z } from "zod";

const navBadgesSchema = z.object({ unread: z.boolean(), blockedTodo: z.boolean() });

export type NavBadges = z.infer<typeof navBadgesSchema>;

export async function fetchNavBadges(slug: string): Promise<NavBadges> {
  const response = await fetch(`/api/me/nav-badges?server=${slug}`);
  if (!response.ok) throw new Error(`nav-badges ${response.status}`);
  const parsed = navBadgesSchema.safeParse(await response.json());
  if (!parsed.success) throw new Error("nav-badges: unexpected response shape");
  return parsed.data;
}
