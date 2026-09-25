export const RULEBOOK_KIND = {
  core: "core",
  supplement: "supplement",
  handbook: "handbook",
} as const;

export type RulebookKind = (typeof RULEBOOK_KIND)[keyof typeof RULEBOOK_KIND];

export const RULEBOOK_KIND_LABEL: Record<RulebookKind, string> = {
  core: "기본",
  supplement: "서플리먼트",
  handbook: "핸드북",
};
