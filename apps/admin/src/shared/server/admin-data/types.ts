import type { RulebookKind } from "@roll-and-call/database";

import type { AuditAction } from "./audit-actions";
import type { PostStatus } from "./post-status";

export type StaffRole = "owner" | "staff";

// 조치를 확정한 운영진. id로 기록하고 nickname은 문구에 쓴다.
export interface Actor {
  id: string;
  nickname: string;
}

export interface Staff {
  userId: string;
  nickname: string;
  role: StaffRole;
  discordId?: string;
  since: Date;
}

export interface Sanction {
  until: Date | null;
  by: string;
  at: Date;
  reason: string;
}

export interface AdminUser {
  id: string;
  nickname: string;
  discordId: string;
  discordHandle: string;
  joinedAt: Date;
  hostedCount: number;
  playedCount: number;
  recentHostedCount: number;
  sanction?: Sanction;
}

export interface Rulebook {
  id: string;
  name: string;
  edition: string;
  category: string;
  kind: RulebookKind;
  supersedesId: string | null;
  aliases: string[];
  certRequired: boolean;
  hidden: boolean;
}

export interface Certification {
  userId: string;
  rulebook: string;
  approvedAt: Date;
  approvedBy: string;
}

export type ShotKey = "front" | "back" | "side";

export type CertStatus = "pending" | "approved" | "rejected";

export interface PreviousRejection {
  rejectedAt: Date;
  tags: string[];
  requests: string[];
}

export interface CertApplication {
  id: string;
  userId: string;
  rulebook: string;
  appliedAt: Date;
  memo: string;
  photoUrls: Partial<Record<ShotKey, string>>;
  replacedShots: ShotKey[];
  // 신청자가 선택으로 낸 구매 기록. 여러 권을 함께 낸 신청은 같은 값을 나눠 쓴다.
  purchase: { captureUrl: string | null; orderNumber: string | null; orderDate: string | null };
  previousRejections: PreviousRejection[];
  status: CertStatus;
  flaggedShots?: ShotKey[];
  processedBy?: string;
  processedAt?: Date;
}

export interface RulebookRequest {
  id: string;
  userId: string;
  name: string;
  note: string;
  requestedAt: Date;
  similarTo?: string;
  processed?: { action: AuditAction; by: string; at: Date };
}

export interface Session {
  id: string;
  title: string;
  rulebook: string;
  gmId: string;
  startsAt: Date;
  // false면 아직 세션 일시가 없어 startsAt이 조율 범위의 끝이나 모집 마감일이다.
  timeFixed?: boolean;
  memberIds: string[];
  capacity: number;
  closed: boolean;
  recruitStatus?: PostStatus;
  waitingIds?: string[];
  createdAt?: Date;
  // 확정 인원이 정원에 닿은 시각. 모집 소요 기간을 잰다.
  filledAt?: Date;
  recruitMethod?: string;
  recruitDeadline?: Date;
  playTime?: string;
  genres?: string[];
  triggers?: string[];
  platforms?: string[];
  aiImage?: boolean;
  // 참여자·대기자가 신청한 시각.
  joinedAt?: Map<string, Date>;
  synopsis?: string;
  notices?: string[];
  imageUrls?: string[];
  thumbnailUrl?: string;
  editRequestedAt?: Date;
  hidden?: { reason: string; by: string; at: Date };
  gmEditSinceHidden?: { title: string; body: string; at: Date };
}

export interface Report {
  id: string;
  sessionId: string;
  reportedAt: Date;
  resolved: boolean;
  reporterId?: string;
  category?: string;
  detail?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
}

export interface NoShow {
  id: string;
  userId: string;
  sessionId: string;
  recordedAt: Date;
  cancelled: boolean;
  cancelledBy?: string;
  cancelledAt?: Date;
  cancelReason?: string;
}

export interface AuditEntry {
  id: string;
  at: Date;
  actor: string;
  action: AuditAction;
  target: string;
  targetUserId?: string;
  reason: string;
  reasonTag?: string;
  staffMemo?: string;
  before?: AuditState;
  after?: AuditState;
  related?: string[];
}

export interface AuditState {
  label: string;
  sub?: string;
}

export interface StaffMemo {
  id: string;
  userId: string;
  author: string;
  at: Date;
  body: string;
}
