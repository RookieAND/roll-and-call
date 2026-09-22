import type { DiscordLinkButton } from "@trpg/discord";

import { gameUrl } from "../game-url";

export function recruitButtons(gameId: string): DiscordLinkButton[] {
  const url = gameUrl(gameId);
  return url ? [{ label: "▶ 참여하러 가기", url }] : [];
}
