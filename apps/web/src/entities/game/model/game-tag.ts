import type { Game } from "@/shared/server";

export type GameTagKey = "genres" | "triggers" | "platforms";

export const GAME_TAG = {
  genres: "genres",
  triggers: "triggers",
  platforms: "platforms",
} as const satisfies Record<GameTagKey, keyof Game>;

export const GAME_TAG_KEYS = [GAME_TAG.genres, GAME_TAG.triggers, GAME_TAG.platforms] as const;

export const gameTagLabel: Record<GameTagKey, string> = {
  [GAME_TAG.genres]: "장르",
  [GAME_TAG.triggers]: "트리거",
  [GAME_TAG.platforms]: "사용 플랫폼",
};
