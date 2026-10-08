import type { Game } from "#/schema/games";

// play_type pgEnum과 같다. 어긋나면 satisfies가 컴파일을 막는다.
export const PLAY_TYPES = ["voice", "text"] as const satisfies readonly Game["playType"][];

export type PlayType = (typeof PLAY_TYPES)[number];

export const PLAY_TYPE = {
  voice: "voice",
  text: "text",
} as const satisfies Record<PlayType, PlayType>;
