export const REVIEW_WINDOW_STATE = { pending: "pending", open: "open", closed: "closed" } as const;
export type ReviewWindowState = (typeof REVIEW_WINDOW_STATE)[keyof typeof REVIEW_WINDOW_STATE];
