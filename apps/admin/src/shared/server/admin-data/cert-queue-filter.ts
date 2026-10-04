// 활성 GM은 최근 90일에 구인을 연 사람이다.
export const CERT_QUEUE_FILTERS = {
  reapplied: "재신청",
  activeGm: "활성 GM",
} as const;
export type CertQueueFilterKey = keyof typeof CERT_QUEUE_FILTERS;

export interface CertQueueFilter {
  query?: string;
  rulebook?: string;
  filter?: CertQueueFilterKey;
}
