export const CERT_FORMAT = { physical: "physical", ebook: "ebook" } as const;

export type CertFormat = (typeof CERT_FORMAT)[keyof typeof CERT_FORMAT];

export const CERT_FORMAT_LABEL: Record<CertFormat, string> = {
  physical: "실물",
  ebook: "전자책",
};
