import "server-only";
import { certifications, db, profiles, rulebooks } from "@roll-and-call/database";
import { and, eq, inArray } from "drizzle-orm";

import { applyOngoingChoices, type OngoingChoice } from "./apply-ongoing-choices";
import { recordAudit } from "./record-audit";
import { rulebookLabel } from "./rulebook-label";
import type { Actor } from "./types";

export interface RevokeInput {
  rulebooks: string[];
  userReason: string;
  staffMemo: string;
  ongoing: OngoingChoice[];
}

// 고른 룰북(이름 판본)의 인증을 한 번에 취소하고 활동 기록은 한 건만 남긴다.
export async function revokeCertifications(userId: string, actor: Actor, input: RevokeInput) {
  const [user] = await db
    .select({ nickname: profiles.username })
    .from(profiles)
    .where(eq(profiles.id, userId));
  if (!user) throw new Error("유저를 찾을 수 없습니다");
  const allRulebooks = await db.select().from(rulebooks);
  const ids = allRulebooks
    .filter((rulebook) => input.rulebooks.includes(rulebookLabel(rulebook)))
    .map((rulebook) => rulebook.id);
  if (ids.length === 0) return { ok: false as const, alreadyRevoked: true as const };

  return db.transaction(async (tx) => {
    const revoked = await tx
      .delete(certifications)
      .where(and(eq(certifications.userId, userId), inArray(certifications.rulebookId, ids)))
      .returning({ rulebookId: certifications.rulebookId });
    if (revoked.length === 0) return { ok: false as const, alreadyRevoked: true as const };
    await applyOngoingChoices(tx, userId, input.ongoing);
    const labels = allRulebooks
      .filter((rulebook) => revoked.some((row) => row.rulebookId === rulebook.id))
      .map(rulebookLabel);
    await recordAudit(tx, actor, {
      action: "인증 취소",
      target: `${user.nickname} · ${labels.join(", ")}`,
      targetUserId: userId,
      reason: input.userReason,
      staffMemo: input.staffMemo || undefined,
      before: { label: "인증됨" },
      after: { label: "인증 취소됨" },
    });
    return { ok: true as const };
  });
}
