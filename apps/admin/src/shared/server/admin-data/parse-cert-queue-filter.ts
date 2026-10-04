import { isString } from "es-toolkit";

import {
  CERT_QUEUE_FILTERS,
  type CertQueueFilter,
  type CertQueueFilterKey,
} from "./cert-queue-filter";

type Param = string | string[] | undefined;

const single = (value: Param) => (isString(value) && value ? value : undefined);

// 대기열과 심사 상세가 같은 주소 쿼리(q, rulebook, filter)를 읽는다.
export function parseCertQueueFilter(params: Record<string, Param>): CertQueueFilter {
  const filter = single(params.filter);
  return {
    query: single(params.q),
    rulebook: single(params.rulebook),
    filter: filter && filter in CERT_QUEUE_FILTERS ? (filter as CertQueueFilterKey) : undefined,
  };
}
