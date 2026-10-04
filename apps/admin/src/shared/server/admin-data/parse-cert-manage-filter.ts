import { isString } from "es-toolkit";

import { CERT_MANAGE_STATUS, type CertManageStatus } from "@/shared/lib";

import type { CertManageFilter } from "./cert-manage-filter";

type Param = string | string[] | undefined;

const single = (value: Param) => (isString(value) && value ? value : undefined);
const STATUSES: readonly string[] = Object.values(CERT_MANAGE_STATUS);

export function parseCertManageFilter(params: Record<string, Param>): CertManageFilter {
  const status = single(params.status);
  return {
    query: single(params.q),
    status: status && STATUSES.includes(status) ? (status as CertManageStatus) : undefined,
    edition: single(params.edition),
    userId: single(params.user),
    rulebookId: single(params.rulebook),
  };
}
