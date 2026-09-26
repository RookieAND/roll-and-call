export const RULEBOOK_DETAIL_TAB = { info: "info", quiz: "quiz", gms: "gms" } as const;
export type RulebookDetailTab = (typeof RULEBOOK_DETAIL_TAB)[keyof typeof RULEBOOK_DETAIL_TAB];
