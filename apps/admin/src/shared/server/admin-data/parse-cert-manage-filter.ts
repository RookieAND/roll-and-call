import { CERT_MANAGE_STATUS, singleParam, type CertManageStatus } from "@/shared/lib";

import type { CertManageFilter } from "./cert-manage-filter";

const STATUSES: readonly string[] = Object.values(CERT_MANAGE_STATUS);

export function parseCertManageFilter(
  params: Record<string, string | string[] | undefined>,
): CertManageFilter {
  const status = singleParam(params.status);
  return {
    query: singleParam(params.q),
    status: status && STATUSES.includes(status) ? (status as CertManageStatus) : undefined,
    edition: singleParam(params.edition),
    userId: singleParam(params.user),
    rulebookId: singleParam(params.rulebook),
  };
}
