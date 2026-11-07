import { and, eq, sql } from "drizzle-orm";

import { db } from "#db/client";
import { recordAudit, type Actor } from "#db/modules/audit";
import { createNotifications } from "#db/modules/notifications";
import { NOTIFICATION_KIND } from "#db/modules/notifications/model";
import { memberNicknameSql } from "#db/modules/profiles";
import { rulebookLabel } from "#db/modules/rulebooks/model";
import {
  homebrewRuleApplications,
  homebrewRules,
  profiles,
  rulebookCategories,
  rulebooks,
} from "#db/schema";

import { hasHomebrewNameConflict } from "../queries/has-homebrew-name-conflict";

export type HomebrewDecision =
  | { kind: "approve" }
  | {
      kind: "reject";
      // 고른 반려 사유 이름. 기타면 null이고 userReason이 사유다.
      reasonTag: string | null;
      userReason: string;
    };

export const HOMEBREW_NAME_TAKEN = "같은 이름의 룰이 이미 있어 승인할 수 없습니다.";

export type HomebrewDecisionResult =
  | { ok: true; userId: string; ruleName: string; rulebookId: string | null }
  | {
      ok: false;
      conflict: { status: "approved" | "rejected" | "withdrawn"; by: string; at: Date };
    }
  | { ok: false; blocked: string };

// 신청 행을 잠가 먼저 처리한 운영진이 이긴다. 늦은 쪽은 아무것도 바꾸지 않고 충돌을 받는다.
// 승인은 이름 중복을 다시 보고, 룰 분류 하나·룰북 하나(core, 인증 필요 꺼짐)·자작 룰 행(제작자만 사용)을 만든다.
export async function decideHomebrewApplication({
  serverId,
  id,
  actor,
  decision,
}: {
  serverId: string;
  id: string;
  actor: Actor;
  decision: HomebrewDecision;
}): Promise<HomebrewDecisionResult> {
  const thisApplication = and(
    eq(homebrewRuleApplications.serverId, serverId),
    eq(homebrewRuleApplications.id, id),
  );
  return db.transaction(async (tx) => {
    const [application] = await tx
      .select({
        userId: homebrewRuleApplications.userId,
        name: homebrewRuleApplications.name,
        edition: homebrewRuleApplications.edition,
        summary: homebrewRuleApplications.summary,
        status: homebrewRuleApplications.status,
        processedAt: homebrewRuleApplications.processedAt,
        processedBy: memberNicknameSql(serverId),
      })
      .from(homebrewRuleApplications)
      .leftJoin(profiles, eq(profiles.id, homebrewRuleApplications.processedBy))
      .where(thisApplication)
      .for("update", { of: homebrewRuleApplications });
    if (!application) throw new Error("신청을 찾을 수 없습니다");
    if (application.status !== "pending") {
      return {
        ok: false,
        conflict: {
          status: application.status,
          by: application.processedBy ?? "알 수 없음",
          at: application.processedAt ?? new Date(),
        },
      };
    }
    const [applicant] = await tx
      .select({ nickname: memberNicknameSql(serverId) })
      .from(profiles)
      .where(eq(profiles.id, application.userId));
    const ruleName = rulebookLabel(application);
    const target = `${applicant?.nickname ?? "알 수 없음"} · ${ruleName}`;
    const notify = (
      kind: typeof NOTIFICATION_KIND.homebrewApproved | typeof NOTIFICATION_KIND.homebrewRejected,
    ) =>
      createNotifications({
        executor: tx,
        serverId,
        actorId: actor.id,
        notifications: [
          { userId: application.userId, kind, params: { applicationId: id, ruleName } },
        ],
      });

    if (decision.kind === "reject") {
      await tx
        .update(homebrewRuleApplications)
        .set({
          status: "rejected",
          processedBy: actor.id,
          processedAt: sql`now()`,
          rejectTag: decision.reasonTag,
          rejectReason: decision.userReason || null,
        })
        .where(thisApplication);
      await recordAudit({
        executor: tx,
        serverId,
        actor,
        entry: {
          action: "자작 룰 반려",
          target,
          targetUserId: application.userId,
          reason: decision.userReason || decision.reasonTag || "",
          reasonTag: decision.reasonTag ?? undefined,
          before: { label: "심사 대기" },
          after: { label: "반려됨" },
        },
      });
      await notify(NOTIFICATION_KIND.homebrewRejected);
      return { ok: true, userId: application.userId, ruleName, rulebookId: null };
    }

    if (
      await hasHomebrewNameConflict({
        executor: tx,
        serverId,
        name: application.name,
        excludeApplicationId: id,
      })
    ) {
      return { ok: false, blocked: HOMEBREW_NAME_TAKEN };
    }
    // ponytail: 이름 검사와 만들기 사이에 같은 이름이 끼어들면 유니크 인덱스가 막아 오류로 끝난다. 다시 누르면 위 검사가 막는다.
    const [category] = await tx
      .insert(rulebookCategories)
      .values({ serverId, name: application.name.trim() })
      .returning({ id: rulebookCategories.id });
    const [rulebook] = await tx
      .insert(rulebooks)
      .values({
        serverId,
        categoryId: category!.id,
        name: application.name.trim(),
        edition: application.edition.trim(),
        kind: "core",
        certRequired: false,
      })
      .returning({ id: rulebooks.id });
    const rulebookId = rulebook!.id;
    await tx.insert(homebrewRules).values({
      rulebookId,
      serverId,
      makerId: application.userId,
      summary: application.summary,
    });
    await tx
      .update(homebrewRuleApplications)
      .set({ status: "approved", processedBy: actor.id, processedAt: sql`now()`, rulebookId })
      .where(thisApplication);
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "자작 룰 승인",
        target,
        targetUserId: application.userId,
        reason: "사용 범위 제작자만 사용",
        before: { label: "심사 대기" },
        after: { label: "승인됨" },
      },
    });
    await notify(NOTIFICATION_KIND.homebrewApproved);
    return { ok: true, userId: application.userId, ruleName, rulebookId };
  });
}
