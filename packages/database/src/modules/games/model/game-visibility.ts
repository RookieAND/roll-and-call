import type { Game } from "#db/schema/games";

// game_visibility pgEnum과 같다. 어긋나면 satisfies가 컴파일을 막는다.
export const GAME_VISIBILITIES = [
  "public",
  "private",
] as const satisfies readonly Game["visibility"][];

export type GameVisibility = (typeof GAME_VISIBILITIES)[number];

export const GAME_VISIBILITY = {
  public: "public",
  private: "private",
} as const satisfies Record<GameVisibility, GameVisibility>;
