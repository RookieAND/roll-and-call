import type { Game } from "#db/schema/games";

// play_type pgEnum과 같다. 어긋나면 satisfies가 컴파일을 막는다.
export const PLAY_TYPES = ["voice", "text", "both"] as const satisfies readonly Game["playType"][];

export type PlayType = (typeof PLAY_TYPES)[number];

export const PLAY_TYPE = {
  voice: "voice",
  text: "text",
  both: "both",
} as const satisfies Record<PlayType, PlayType>;

export const PLAY_TYPE_LABEL = {
  voice: "보이스",
  text: "텍스트",
  both: "보이스·텍스트",
} as const satisfies Record<PlayType, string>;
