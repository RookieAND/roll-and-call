import type { Game } from "#/schema/games";

// game_kind pgEnum과 같다. 어긋나면 satisfies가 컴파일을 막는다.
export const GAME_KINDS = ["session", "briefing"] as const satisfies readonly Game["kind"][];

export type GameKind = (typeof GAME_KINDS)[number];

export const GAME_KIND = {
  session: "session",
  briefing: "briefing",
} as const satisfies Record<GameKind, GameKind>;
