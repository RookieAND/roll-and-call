import { singleParam } from "@/shared/lib";

import type { CertQueueFilter } from "./cert-queue-filter";
import { isCertQueueFilterKey } from "./is-cert-queue-filter-key";

// 대기열과 심사 상세가 같은 주소 쿼리(q, rulebook, filter)를 읽는다.
export function parseCertQueueFilter(
  params: Record<string, string | string[] | undefined>,
): CertQueueFilter {
  const filter = singleParam(params.filter);
  return {
    query: singleParam(params.q),
    rulebook: singleParam(params.rulebook),
    filter: isCertQueueFilterKey(filter) ? filter : undefined,
  };
}
