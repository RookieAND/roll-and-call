import type { RulebookKind } from "#/schema";

export const RULEBOOK_KIND = {
  core: "core",
  supplement: "supplement",
  handbook: "handbook",
} as const satisfies Record<string, RulebookKind>;
