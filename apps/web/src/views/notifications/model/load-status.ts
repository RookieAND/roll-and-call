export const LOAD_STATUS = { idle: "idle", loading: "loading", error: "error" } as const;

export type LoadStatus = (typeof LOAD_STATUS)[keyof typeof LOAD_STATUS];
