import { siteOrigin } from "./site-origin";

export function gameUrl(id: string): string | undefined {
  const origin = siteOrigin();
  return origin ? `${origin}/games/${id}` : undefined;
}
