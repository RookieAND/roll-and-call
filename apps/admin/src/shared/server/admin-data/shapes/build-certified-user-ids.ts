import { isNull } from "es-toolkit";

import type { ShapeContext } from "./shape-context";

// 지금 인증이 살아 있는 (사용자, 룰북) 하나마다 사용자 ID 한 개.
export function buildCertifiedUserIds({ tables }: ShapeContext): string[] {
  return tables.certificationRows.filter((row) => isNull(row.revokedAt)).map((row) => row.userId);
}
