import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";

import { db } from "#/client";
import {
  applyOngoingChoices,
  type OngoingChoice,
} from "#/modules/moderation/commands/apply-ongoing-choices";
import { recordAudit } from "#/modules/moderation/commands/record-audit";
import type { Actor } from "#/modules/moderation/model/types";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { rulebookLabel } from "#/modules/rulebooks/model/rulebook-label";
import { certApplications, certifications, profiles, rulebooks } from "#/schema";

export interface RevokeInput {
  rulebooks: string[];
  userReason: string;
  staffMemo: string;
  ongoing: OngoingChoice[];
}

// 인증을 지우고, 마지막 승인 신청을 반려로 바꾼다. 신청 없이 직접 준 인증이면 반려 기록을 새로 만든다.
// 증빙 이미지(사진·구매 캡처·영수증) URL을 비우면 어느 행도 가리키지 않게 되어 하루 한 번 도는 정리 작업(0041)이 파일을 지운다.
export async function revokeCertifications({
  serverId,
  userId,
  actor,
  input,
}: {
  serverId: string;
  userId: string;
  actor: Actor;
  input: RevokeInput;
}) {
  const [user] = await db
    .select({ nickname: memberNicknameSql(serverId) })
    .from(profiles)
    .where(eq(profiles.id, userId));
  if (!user) throw new Error("유저를 찾을 수 없습니다");
  const allRulebooks = await db.select().from(rulebooks).where(eq(rulebooks.serverId, serverId));
  const ids = allRulebooks
    .filter((rulebook) => input.rulebooks.includes(rulebookLabel(rulebook)))
    .map((rulebook) => rulebook.id);
  if (ids.length === 0) return { ok: false as const, alreadyRevoked: true as const };

  return db.transaction(async (tx) => {
    const revoked = await tx
      .delete(certifications)
      .where(
        and(
          eq(certifications.serverId, serverId),
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
        photoUrls: {},
        purchaseCaptureUrl: null,
        receiptUrl: null,
        processedBy: actor.id,
        processedAt: sql`now()`,
      };
      const [approved] = await tx
        .select({ id: certApplications.id })
        .from(certApplications)
        .where(
          and(
            eq(certApplications.serverId, serverId),
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
          .where(
            and(eq(certApplications.serverId, serverId), eq(certApplications.id, approved.id)),
          );
      } else {
        await tx
          .insert(certApplications)
          .values({ serverId, userId, rulebookId, direct: true, ...rejection });
      }
    }
    if (revoked.length === 0) return { ok: false as const, alreadyRevoked: true as const };
    await applyOngoingChoices({
      transaction: tx,
      serverId,
      userId,
      actorId: actor.id,
      choices: input.ongoing,
    });
    const labels = allRulebooks
      .filter((rulebook) => revoked.some((row) => row.rulebookId === rulebook.id))
      .map(rulebookLabel);
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "반려로 돌림",
        target: `${user.nickname} · ${labels.join(", ")}`,
        targetUserId: userId,
        reason: input.userReason,
        staffMemo: input.staffMemo || undefined,
        before: { label: "인증됨" },
        after: { label: "반려됨" },
      },
    });
    return { ok: true as const };
  });
}
