// GM별 인증 현황의 필터. 기본은 운영진이 챙길 사람(미신청·심사 대기)만 본다.
export const GM_CERT_VIEW = { todo: "todo", done: "done", all: "all" } as const;
export type GmCertView = (typeof GM_CERT_VIEW)[keyof typeof GM_CERT_VIEW];
