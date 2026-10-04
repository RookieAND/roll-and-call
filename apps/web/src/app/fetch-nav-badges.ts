export type NavBadges = { unread: boolean; blockedTodo: boolean };

export async function fetchNavBadges(slug: string): Promise<NavBadges> {
  const response = await fetch(`/api/me/nav-badges?server=${slug}`);
  if (!response.ok) throw new Error(`nav-badges ${response.status}`);
  return (await response.json()) as NavBadges;
}
