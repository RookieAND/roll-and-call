import "server-only";
import { uniq } from "es-toolkit";

import type { CertQueueFilter } from "./cert-queue-filter";
import { certQueueRows } from "./cert-queue-rows";
import { filterCertQueue } from "./filter-cert-queue";
import { loadSnapshot } from "./snapshot";

export async function listCertQueue(filter: CertQueueFilter) {
  const db = await loadSnapshot();
  const pending = certQueueRows({
    records: db,
    applications: db.certApplications.filter((application) => application.status === "pending"),
  });
  return {
    total: pending.length,
    rows: filterCertQueue({ rows: pending, filter }),
    rulebookOptions: uniq(pending.map((row) => row.rulebook)).toSorted(),
  };
}
