export const JOIN_STATUS = { checking: "checking", denied: "denied", failed: "failed" } as const;
export type JoinStatus = (typeof JOIN_STATUS)[keyof typeof JOIN_STATUS];
