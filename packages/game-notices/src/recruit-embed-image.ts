import type { Game } from "@roll-and-call/database";
import type { DiscordEmbed } from "@roll-and-call/discord";

import { defaultBannerUrl } from "./default-banner-url";

// 썸네일이 없으면 기본 배너를 싣는다. 디스코드 임베드 이미지는 가릴 수 없어서 스포일러 썸네일은 싣지 않는다.
export function recruitEmbedImage(
  game: Pick<Game, "thumbnailUrl" | "thumbnailSpoiler">,
): DiscordEmbed["image"] {
  if (!game.thumbnailUrl) {
    const bannerUrl = defaultBannerUrl();
    return bannerUrl ? { url: bannerUrl } : undefined;
  }
  return game.thumbnailSpoiler ? undefined : { url: game.thumbnailUrl };
}
