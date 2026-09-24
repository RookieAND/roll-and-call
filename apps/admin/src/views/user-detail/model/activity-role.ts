export const ACTIVITY_ROLE = { all: "all", hosted: "hosted", played: "played" } as const;
export type ActivityRole = (typeof ACTIVITY_ROLE)[keyof typeof ACTIVITY_ROLE];
