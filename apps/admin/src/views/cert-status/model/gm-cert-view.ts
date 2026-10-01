export const GM_CERT_VIEW = { todo: "todo", done: "done", all: "all" } as const;
export type GmCertView = (typeof GM_CERT_VIEW)[keyof typeof GM_CERT_VIEW];
