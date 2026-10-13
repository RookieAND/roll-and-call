import type { AuditState } from "#/schema/moderation";

import type { AuditAction } from "./audit-actions";

export type StaffRole = "owner" | "staff";

// 플랫폼 관리자가 한 조치는 활동 기록에 배지를 붙인다. 시스템 조치는 recordAudit에 actor 없이 넘긴다.
export type AuditActorKind = "staff" | "platform" | "system";

export interface Actor {
  id: string;
  nickname: string;
  kind?: Exclude<AuditActorKind, "system">;
}

export interface Sanction {
  until: Date | null;
  by: string;
  at: Date;
  reason: string;
}

export type ShotKey = "front" | "back";

// 여러 권을 함께 신청한 묶음 사진의 추가 증빙 칸. 반려로 지정하는 사진은 아니라서 ShotKey에는 넣지 않는다.
export type ExtraShotKey = "extra1" | "extra2" | "extra3";
export type PhotoKey = ShotKey | ExtraShotKey;

export type { AuditChange, AuditState } from "#/schema/moderation";

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
