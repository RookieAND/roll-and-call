import type { RulebookKind } from "@roll-and-call/database";

export const RULEBOOK_KIND_LABEL = {
  core: "기본 룰북",
  supplement: "서플리먼트",
  handbook: "핸드북",
} as const satisfies Record<RulebookKind, string>;
