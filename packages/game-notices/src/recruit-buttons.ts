import type { DiscordButton } from "@roll-and-call/discord";

import { gameUrl } from "./game-url";

export const APPLY_BUTTON_PREFIX = "apply:";

export function recruitButtons({
  slug,
  gameId,
}: {
  slug: string;
  gameId: string;
}): DiscordButton[] {
  const url = gameUrl({ slug, gameId });
  return [
    { label: "✅ 바로 신청하기", customId: `${APPLY_BUTTON_PREFIX}${gameId}` },
    ...(url ? [{ label: "📄 구인글 상세보기", url }] : []),
  ];
}
