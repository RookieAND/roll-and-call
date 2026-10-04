export const CERT_ROW_ACTION = { revoke: "revoke", review: "review", log: "log" } as const;
export type CertRowAction = (typeof CERT_ROW_ACTION)[keyof typeof CERT_ROW_ACTION];

export interface CertRowActionLink {
  action: CertRowAction;
  href: string;
}
