import type { RulebookKind } from "#db/schema";

export const RULEBOOK_KIND = {
  core: "core",
  supplement: "supplement",
  handbook: "handbook",
} as const satisfies Record<string, RulebookKind>;
