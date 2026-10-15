import "server-only";
import { uniq } from "es-toolkit";

import { loadSnapshot } from "@/shared/server";

import type { CertQueueFilter } from "../model/cert-queue-filter";
import { certQueueRows } from "../model/cert-queue-rows";
import { filterCertQueue } from "../model/filter-cert-queue";

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
