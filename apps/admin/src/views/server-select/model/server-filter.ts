export const SERVER_FILTER = { bot: "bot", pending: "pending" } as const;
export type ServerFilter = (typeof SERVER_FILTER)[keyof typeof SERVER_FILTER];
