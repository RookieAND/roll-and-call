import { eq } from "drizzle-orm";

import { db } from "../../../client";
import { servers } from "../../../schema";
import { recordAudit } from "../../moderation/commands/record-audit";
import { formatDate } from "../../moderation/model/format-date";
import type { Actor } from "../../moderation/model/types";

export const ENFORCEMENT_CHANGE = { set: "지정", postpone: "연기" } as const;
export type EnforcementChange = keyof typeof ENFORCEMENT_CHANGE;

export async function updateCertEnforcementDate({
  serverId,
  date,
  change,
  actor,
}: {
  serverId: string;
  date: Date;
  change: EnforcementChange;
  actor: Actor;
}) {
  await db.transaction(async (tx) => {
    const [current] = await tx
      .select({ certEnforcementDate: servers.certEnforcementDate })
      .from(servers)
      .where(eq(servers.id, serverId));
    if (!current) throw new Error("서버를 찾을 수 없습니다");
    await tx.update(servers).set({ certEnforcementDate: date }).where(eq(servers.id, serverId));
    const before = current.certEnforcementDate;
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "적용일 변경",
        target: `룰북 인증 적용일 · ${ENFORCEMENT_CHANGE[change]}`,
        reason: "",
        before: { label: before ? formatDate(before) : "미지정" },
        after: { label: formatDate(date) },
      },
    });
  });
}
