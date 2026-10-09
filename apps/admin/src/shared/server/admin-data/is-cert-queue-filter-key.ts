import { isString } from "es-toolkit";

import { CERT_QUEUE_FILTERS, type CertQueueFilterKey } from "./cert-queue-filter";

export function isCertQueueFilterKey(value: unknown): value is CertQueueFilterKey {
  return isString(value) && Object.hasOwn(CERT_QUEUE_FILTERS, value);
}
