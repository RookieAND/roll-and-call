import type { DiscordLinkButton } from "@roll-and-call/discord";

import { gameUrl } from "../game-url";

export function recruitButtons({
  slug,
  gameId,
}: {
  slug: string;
  gameId: string;
}): DiscordLinkButton[] {
  const url = gameUrl({ slug, gameId });
  return url ? [{ label: "▶ 참여하러 가기", url }] : [];
}
