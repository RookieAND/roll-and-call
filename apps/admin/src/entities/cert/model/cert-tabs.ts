export type CertTabCountKey = "cert" | "homebrew";

export const CERT_TABS = [
  { label: "심사 대기열", href: "/cert", countKey: "cert" },
  { label: "자작 룰", href: "/cert/maker", countKey: "homebrew" },
  { label: "인증 관리", href: "/cert/manage" },
  { label: "유예 기간", href: "/cert/grace" },
] as const satisfies readonly { label: string; href: string; countKey?: CertTabCountKey }[];
