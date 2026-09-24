import "server-only";
import { formatDate } from "@/shared/lib";

import { db } from "./mock-db";
import { recordAudit } from "./record-audit";

export const ENFORCEMENT_CHANGE = { set: "지정", postpone: "연기" } as const;
export type EnforcementChange = keyof typeof ENFORCEMENT_CHANGE;

export async function updateCertEnforcementDate(
  date: Date,
  change: EnforcementChange,
  actor: string,
) {
  const before = db.settings.certEnforcementDate;
  db.settings.certEnforcementDate = date;
  recordAudit({
    actor,
    action: "적용일 변경",
    target: `룰북 인증 적용일 · ${ENFORCEMENT_CHANGE[change]}`,
    reason: "",
    before: { label: formatDate(before) },
    after: { label: formatDate(date) },
  });
}
