import { singleParam } from "@/shared/lib";

import {
  CERT_QUEUE_FILTERS,
  type CertQueueFilter,
  type CertQueueFilterKey,
} from "./cert-queue-filter";

// 대기열과 심사 상세가 같은 주소 쿼리(q, rulebook, filter)를 읽는다.
export function parseCertQueueFilter(
  params: Record<string, string | string[] | undefined>,
): CertQueueFilter {
  const filter = singleParam(params.filter);
  return {
    query: singleParam(params.q),
    rulebook: singleParam(params.rulebook),
    filter: filter && filter in CERT_QUEUE_FILTERS ? (filter as CertQueueFilterKey) : undefined,
  };
}
