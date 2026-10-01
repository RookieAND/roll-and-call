export const RULEBOOK_KIND = {
  core: "core",
  supplement: "supplement",
  handbook: "handbook",
} as const;

export type RulebookKind = (typeof RULEBOOK_KIND)[keyof typeof RULEBOOK_KIND];

export const RULEBOOK_KIND_LABEL: Record<RulebookKind, string> = {
  core: "기본",
  supplement: "서플리먼트",
  handbook: "플레이어 책",
};

export const RULEBOOK_KIND_GROUP: Record<RulebookKind, string> = {
  core: "기본 룰북",
  supplement: "서플리먼트",
  handbook: "플레이어 책",
};
