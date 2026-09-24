import "server-only";
import { db } from "./mock-db";
import type { AuditEntry } from "./types";

// 확정한 조치는 모두 이 함수로 활동 기록 한 건을 남긴다.
export function recordAudit(entry: Omit<AuditEntry, "id" | "at">) {
  db.auditLog.unshift({ id: `a${db.auditLog.length + 1}`, at: new Date(), ...entry });
}
