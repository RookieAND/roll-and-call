import type { AuditAction } from "./audit-actions";

export type StaffRole = "owner" | "staff";

export interface Actor {
  id: string;
  nickname: string;
}

export interface Sanction {
  until: Date | null;
  by: string;
  at: Date;
  reason: string;
}

export type ShotKey = "front" | "back" | "side";

export interface AuditState {
  label: string;
  sub?: string;
}

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
