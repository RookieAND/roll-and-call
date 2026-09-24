import "server-only";
import { adminSettings, db } from "@roll-and-call/database";

import { formatDate } from "@/shared/lib";

import { recordAudit } from "./record-audit";
import type { Actor } from "./types";

export const ENFORCEMENT_CHANGE = { set: "지정", postpone: "연기" } as const;
export type EnforcementChange = keyof typeof ENFORCEMENT_CHANGE;

export async function updateCertEnforcementDate(
  date: Date,
  change: EnforcementChange,
  actor: Actor,
) {
  await db.transaction(async (tx) => {
    const [current] = await tx.select().from(adminSettings);
    await tx
      .insert(adminSettings)
      .values({ id: true, certEnforcementDate: date })
      .onConflictDoUpdate({ target: adminSettings.id, set: { certEnforcementDate: date } });
    const before = current?.certEnforcementDate;
    await recordAudit(tx, actor, {
      action: "적용일 변경",
      target: `룰북 인증 적용일 · ${ENFORCEMENT_CHANGE[change]}`,
      reason: "",
      before: { label: before ? formatDate(before) : "미지정" },
      after: { label: formatDate(date) },
    });
  });
}
