import type { CertApplication } from "@/shared/server";

import type { CertQueueRow } from "./cert-queue-rows";

// 같은 묶음의 신청은 한 줄로 합친다. 심사 화면에서 묶음 전체를 한꺼번에 처리하기 때문이다.
// 대표는 가장 먼저 낸 신청이고, 기본 룰북이 있으면 그것을 앞세운다.
export function mergeGroupRows({
  rows,
  applications,
}: {
  rows: CertQueueRow[];
  applications: CertApplication[];
}) {
  const groupOf = new Map(applications.map((application) => [application.id, application.groupId]));
  const merged: CertQueueRow[] = [];
  const representative = new Map<string, CertQueueRow>();
  for (const row of rows) {
    const groupId = groupOf.get(row.id);
    if (!groupId) {
      merged.push(row);
      continue;
    }
    const existing = representative.get(groupId);
    if (!existing) {
      const first = { ...row };
      representative.set(groupId, first);
      merged.push(first);
      continue;
    }
    existing.groupCount += 1;
    if (existing.kind !== "core" && row.kind === "core") {
      Object.assign(existing, {
        id: row.id,
        rulebook: row.rulebook,
        category: row.category,
        kind: row.kind,
      });
    }
  }
  return merged;
}
