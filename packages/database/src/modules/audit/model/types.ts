import type { AuditState } from "#db/schema/moderation";

import type { AuditAction } from "./audit-actions";

// 플랫폼 관리자가 한 조치는 활동 기록에 배지를 붙인다. 시스템 조치는 recordAudit에 actor 없이 넘긴다.
export type AuditActorKind = "staff" | "platform" | "system";

export interface Actor {
  id: string;
  nickname: string;
  kind?: Exclude<AuditActorKind, "system">;
}

export type { AuditChange, AuditState } from "#db/schema/moderation";

export interface AuditInput {
  action: AuditAction;
  target: string;
  targetUserId?: string;
  targetGameId?: string;
  reason: string;
  reasonTag?: string;
  staffMemo?: string;
  before?: AuditState;
  after?: AuditState;
  related?: string[];
}
