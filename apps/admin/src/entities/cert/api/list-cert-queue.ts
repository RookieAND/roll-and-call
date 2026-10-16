import "server-only";
import { sumBy, uniq } from "es-toolkit";

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
    // 한 묶음 신청은 한 줄로 합쳐 보이지만, 사이드바 건수와 같게 책 수로 센다.
    total: sumBy(pending, (row) => row.groupCount),
    rows: filterCertQueue({ rows: pending, filter }),
    rulebookOptions: uniq(pending.map((row) => row.rulebook)).toSorted(),
  };
}
