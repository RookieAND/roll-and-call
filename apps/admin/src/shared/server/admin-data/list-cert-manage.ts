import "server-only";
import { rulebookLabel } from "@roll-and-call/database/rulebooks/model";
import { uniq } from "es-toolkit";

import type { TableSort } from "@/shared/lib";

import type { CertManageFilter } from "./cert-manage-filter";
import { certManageRows } from "./cert-manage-rows";
import type { CertManageSortColumn } from "./cert-manage-sort";
import { filterCertManage } from "./filter-cert-manage";
import { orderCertManage } from "./order-cert-manage";
import { loadSnapshot } from "./snapshot";

export async function listCertManage({
  filter,
  sort,
}: {
  filter: CertManageFilter;
  sort: TableSort<CertManageSortColumn>;
}) {
  const db = await loadSnapshot();
  const all = certManageRows({ records: db, now: Date.now() });
  const filteredUser = db.users.find((user) => user.id === filter.userId);
  const filteredBook = db.rulebooks.find((rulebook) => rulebook.id === filter.rulebookId);
  return {
    total: all.length,
    rows: orderCertManage({ rows: filterCertManage({ rows: all, filter }), sort }),
    editionOptions: uniq(all.map((row) => row.edition)).toSorted((a, b) =>
      a.localeCompare(b, "ko"),
    ),
    pendingCount: db.certApplications.filter((application) => application.status === "pending")
      .length,
    userLabel: filteredUser?.nickname,
    rulebookLabel: filteredBook ? rulebookLabel(filteredBook) : undefined,
  };
}

export type CertManageList = Awaited<ReturnType<typeof listCertManage>>;
