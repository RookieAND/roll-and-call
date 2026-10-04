import { AUDIT_ACTION_GROUPS } from "@roll-and-call/database/moderation/model";

import type { AuditEntry } from "./types";

export const AUDIT_SUBJECT = {
  user: "user",
  game: "game",
  review: "review",
  rulebook: "rulebook",
  other: "other",
} as const;
export type AuditSubjectKind = (typeof AUDIT_SUBJECT)[keyof typeof AUDIT_SUBJECT];

type SubjectEntry = Pick<
  AuditEntry,
  "action" | "target" | "targetUserId" | "targetGameId" | "reviewId" | "rulebookId"
>;

interface AuditSubject {
  kind: AuditSubjectKind;
  // 조치 상세 ⋯ 메뉴의 [… 상세 열기] 경로. 대상 ID가 없으면 비운다.
  openPath?: string;
  // [같은 대상의 조치 보기]가 거르는 값(auditLogHref 인자).
  sameTarget: { targetUserId?: string; targetGameId?: string; target?: string };
}

// 조치 종류로 대상이 유저·구인·후기·룰북 중 무엇인지 정한다(시안 log_detail_menus).
export function auditSubject(entry: SubjectEntry): AuditSubject {
  const targetName = entry.target.split(" · ")[0];
  const group = AUDIT_ACTION_GROUPS.find((candidate) =>
    (candidate.actions as readonly string[]).includes(entry.action),
  )?.label;
  if (entry.action.startsWith("후기")) {
    return {
      kind: AUDIT_SUBJECT.review,
      openPath: entry.reviewId && `/reviews/${entry.reviewId}`,
      sameTarget: { targetUserId: entry.targetUserId, targetGameId: entry.targetGameId },
    };
  }
  if (group === "룰북") {
    return {
      kind: AUDIT_SUBJECT.rulebook,
      openPath: entry.rulebookId && `/rules/${entry.rulebookId}`,
      sameTarget: { target: targetName },
    };
  }
  if (entry.targetGameId && (group === "구인" || !entry.targetUserId)) {
    return {
      kind: AUDIT_SUBJECT.game,
      openPath: `/posts/${entry.targetGameId}`,
      sameTarget: { targetGameId: entry.targetGameId },
    };
  }
  if (entry.targetUserId) {
    return {
      kind: AUDIT_SUBJECT.user,
      openPath: `/users/${entry.targetUserId}`,
      sameTarget: { targetUserId: entry.targetUserId },
    };
  }
  return { kind: AUDIT_SUBJECT.other, sameTarget: { target: targetName } };
}
