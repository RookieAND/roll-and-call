import type { AuditAction } from "./audit-actions";
import type { PostStatus } from "./post-status";

export type StaffRole = "owner" | "staff";

export interface Staff {
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

export type ShotKey = "full" | "front" | "back" | "side";

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
  memberIds: string[];
  capacity: number;
  closed: boolean;
  recruitStatus?: PostStatus;
  waitingIds?: string[];
  createdAt?: Date;
  recruitMethod?: string;
  recruitDeadline?: Date;
  expectedHours?: number;
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
