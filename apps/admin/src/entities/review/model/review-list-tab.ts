export const REVIEW_LIST_TAB = { all: "all", hidden: "hidden" } as const;
export type ReviewListTab = (typeof REVIEW_LIST_TAB)[keyof typeof REVIEW_LIST_TAB];
