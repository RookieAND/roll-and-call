import type { CertFormat } from "@/shared/server";

export const CERT_FORMAT_LABEL = {
  physical: "실물",
  ebook: "전자책",
} as const satisfies Record<CertFormat, string>;
