export const RULEBOOK_KIND = {
  core: "core",
  supplement: "supplement",
  handbook: "handbook",
} as const;

export type RulebookKind = (typeof RULEBOOK_KIND)[keyof typeof RULEBOOK_KIND];

// 배지에 쓰는 짧은 이름과 목록 머리글에 쓰는 이름.
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
