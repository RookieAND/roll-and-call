export const CERT_STATUS_TAB = { rulebook: "rulebook", gm: "gm" } as const;
export type CertStatusTab = (typeof CERT_STATUS_TAB)[keyof typeof CERT_STATUS_TAB];
