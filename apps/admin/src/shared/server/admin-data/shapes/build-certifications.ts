import { isNull } from "es-toolkit";

import type { Certification } from "../types";
import type { ShapeContext } from "./shape-context";

export function buildCertifications({
  tables,
  nicknameOf,
  rulebookLabelOf,
}: ShapeContext): Certification[] {
  return tables.certificationRows
    .filter((row) => isNull(row.revokedAt))
    .map((row) => ({
      userId: row.userId,
      rulebookId: row.rulebookId,
      rulebook: rulebookLabelOf(row.rulebookId) ?? "",
      approvedAt: row.approvedAt,
      approvedBy: nicknameOf(row.approvedBy),
    }));
}
