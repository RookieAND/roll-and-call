import { groupBy } from "es-toolkit";

import { sortRows, type SortDir } from "@/shared/lib";

import type { CertManageRow } from "./cert-manage-row";
import type { CertManageSortColumn } from "./cert-manage-sort";

// 고른 열로 정렬한 뒤 같은 유저의 행을 그 유저의 첫 행 자리에 모은다. 모은 행 중 둘째부터는 유저 칸을 비운다(D288).
export function orderCertManage({
  rows,
  sort,
}: {
  rows: CertManageRow[];
  sort: { column: CertManageSortColumn; dir: SortDir };
}) {
  const sorted = sortRows({
    rows,
    sort,
    accessors: { user: (row) => row.nickname, changed: (row) => row.changedAt },
  });
  return Object.values(groupBy(sorted, (row) => row.userId)).flatMap((group) =>
    group.map((row, index) => ({ ...row, sameUserAsAbove: index > 0 })),
  );
}

export type OrderedCertManageRow = ReturnType<typeof orderCertManage>[number];
