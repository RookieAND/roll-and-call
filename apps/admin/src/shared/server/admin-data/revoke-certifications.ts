import "server-only";
import { certApplications, certifications, db, profiles, rulebooks } from "@roll-and-call/database";
import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";

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

// 고른 룰북(이름 판본)의 인증을 한 번에 반려로 돌리고 활동 기록은 한 건만 남긴다.
// 인증을 지우고, 마지막 승인 신청을 반려로 바꾼다(사진은 남긴다). 신청 없이 직접 준 인증이면 반려 기록을 새로 만든다.
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
      .where(
        and(
          eq(certifications.userId, userId),
          inArray(certifications.rulebookId, ids),
          isNull(certifications.revokedAt),
        ),
      )
      .returning({ rulebookId: certifications.rulebookId });
    for (const { rulebookId } of revoked) {
      const rejection = {
        status: "rejected" as const,
        rejectReason: input.userReason,
        flaggedShots: [],
        processedBy: actor.id,
        processedAt: sql`now()`,
      };
      const [approved] = await tx
        .select({ id: certApplications.id })
        .from(certApplications)
        .where(
          and(
            eq(certApplications.userId, userId),
            eq(certApplications.rulebookId, rulebookId),
            eq(certApplications.status, "approved"),
          ),
        )
        .orderBy(desc(certApplications.createdAt))
        .limit(1);
      if (approved) {
        await tx
          .update(certApplications)
          .set(rejection)
          .where(eq(certApplications.id, approved.id));
      } else {
        await tx
          .insert(certApplications)
          .values({ userId, rulebookId, direct: true, ...rejection });
      }
    }
    if (revoked.length === 0) return { ok: false as const, alreadyRevoked: true as const };
    await applyOngoingChoices(tx, userId, input.ongoing);
    const labels = allRulebooks
      .filter((rulebook) => revoked.some((row) => row.rulebookId === rulebook.id))
      .map(rulebookLabel);
    await recordAudit(tx, actor, {
      action: "반려로 돌림",
      target: `${user.nickname} · ${labels.join(", ")}`,
      targetUserId: userId,
      reason: input.userReason,
      staffMemo: input.staffMemo || undefined,
      before: { label: "인증됨" },
      after: { label: "반려됨" },
    });
    return { ok: true as const };
  });
}
