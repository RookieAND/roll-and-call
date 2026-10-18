import { OG_IMAGE } from "./og-image";

interface GameOgImageSource {
  thumbnailSpoiler: boolean;
  thumbnailUrl: string | null;
}

export function gameOgImage(game: GameOgImageSource) {
  return game.thumbnailSpoiler ? OG_IMAGE : (game.thumbnailUrl ?? OG_IMAGE);
}
