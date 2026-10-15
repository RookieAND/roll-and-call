import type { CertQueueFilter } from "./cert-queue-filter";
import type { CertQueueRow } from "./cert-queue-rows";

export function filterCertQueue({
  rows,
  filter,
}: {
  rows: CertQueueRow[];
  filter: CertQueueFilter;
}) {
  const query = filter.query?.toLowerCase();
  return rows.filter(
    (row) =>
      (!query || row.nickname.toLowerCase().includes(query)) &&
      (!filter.rulebook || row.rulebook === filter.rulebook) &&
      (filter.filter !== "reapplied" || row.previousRejectionCount > 0) &&
      (filter.filter !== "activeGm" || row.activeGm),
  );
}
