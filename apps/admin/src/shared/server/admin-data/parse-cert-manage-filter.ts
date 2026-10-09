import { isCertManageStatus, singleParam } from "@/shared/lib";

import type { CertManageFilter } from "./cert-manage-filter";

export function parseCertManageFilter(
  params: Record<string, string | string[] | undefined>,
): CertManageFilter {
  const status = singleParam(params.status);
  return {
    query: singleParam(params.q),
    status: isCertManageStatus(status) ? status : undefined,
    edition: singleParam(params.edition),
    userId: singleParam(params.user),
    rulebookId: singleParam(params.rulebook),
  };
}
