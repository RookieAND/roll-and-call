import "server-only";
import type { AuditAction } from "./audit-actions";
import { db } from "./mock-db";
import { postAuditTarget } from "./post-audit-target";
import { recordAudit } from "./record-audit";

export type PostModerationAction = "edit" | "hide" | "unhide" | "resolve";

export interface PostModeration {
  action: PostModerationAction;
  userReason: string;
  staffMemo: string;
}

export type PostModerationResult =
  | { ok: true }
  | { ok: false; conflict: { action: AuditAction; by: string; at: Date } | null };

const AUDIT_ACTION = {
  edit: "구인 수정 요청",
  hide: "구인 숨김",
  unhide: "구인 숨김 해제",
  resolve: "신고 처리 완료",
} as const satisfies Record<PostModerationAction, AuditAction>;

const POST_AUDIT_ACTIONS: AuditAction[] = Object.values(AUDIT_ACTION);

// 구인 조치 확정. 무엇을 확정하든 그 구인의 처리 안 된 신고는 모두 처리됨으로 바뀐다.
// 이미 상태가 바뀐 구인이면 아무것도 바꾸지 않고, 마지막으로 처리한 조치를 충돌로 돌려준다.
export async function moderatePost(
  id: string,
  actor: string,
  moderation: PostModeration,
): Promise<PostModerationResult> {
  const session = db.sessions.find((candidate) => candidate.id === id);
  if (!session) throw new Error("구인을 찾을 수 없습니다");
  const target = postAuditTarget(session);
  const unresolved = db.reports.filter((report) => report.sessionId === id && !report.resolved);
  const stale =
    (moderation.action === "hide" && session.hidden) ||
    (moderation.action === "unhide" && !session.hidden) ||
    (moderation.action === "resolve" && unresolved.length === 0);
  if (stale) {
    const latest = db.auditLog.find(
      (entry) => entry.target === target && POST_AUDIT_ACTIONS.includes(entry.action),
    );
    return {
      ok: false,
      conflict: latest ? { action: latest.action, by: latest.actor, at: latest.at } : null,
    };
  }

  const before = { label: session.hidden ? "숨김 중" : "공개" };
  const now = new Date();
  for (const report of unresolved) {
    report.resolved = true;
    report.resolvedBy = actor;
    report.resolvedAt = now;
  }
  if (moderation.action === "edit") session.editRequestedAt = now;
  if (moderation.action === "hide") {
    session.hidden = { reason: moderation.userReason, by: actor, at: now };
    session.gmEditSinceHidden = undefined;
  }
  if (moderation.action === "unhide") {
    session.hidden = undefined;
    session.gmEditSinceHidden = undefined;
  }
  // ponytail: GM 알림(수정 요청·숨김)은 목업이라 보내지 않는다. 실제 API에서 디스코드 DM으로 보낸다.

  recordAudit({
    actor,
    action: AUDIT_ACTION[moderation.action],
    target,
    reason: moderation.userReason || moderation.staffMemo,
    staffMemo: moderation.userReason ? moderation.staffMemo || undefined : undefined,
    before,
    after: { label: session.hidden ? "숨김 중" : "공개" },
    related: unresolved.length ? [`처리 안 된 신고 ${unresolved.length}건 처리됨`] : undefined,
  });
  return { ok: true };
}
