export const REQUEST_ACTION = { add: "add", link: "link", reject: "reject" } as const;
export type RequestAction = (typeof REQUEST_ACTION)[keyof typeof REQUEST_ACTION];
