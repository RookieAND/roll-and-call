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
  rulebookId: string;
  rulebook: string;
  approvedAt: Date;
  approvedBy: string;
}

export type ShotKey = "front" | "back" | "side";

// withdrawn은 신청자가 심사 전에 거둔 신청이다.
export type CertStatus = "pending" | "approved" | "rejected" | "withdrawn";

export interface PreviousRejection {
  rejectedAt: Date;
  tags: string[];
  requests: string[];
}

export type CertFormat = "physical" | "ebook";

export interface CertApplication {
  id: string;
  userId: string;
  rulebookId: string;
  rulebook: string;
  // 여러 권을 한 번에 낸 신청끼리 같은 값. 한 권이면 null.
  groupId: string | null;
  format: CertFormat;
  appliedAt: Date;
  memo: string;
  photoUrls: Partial<Record<ShotKey, string>>;
  replacedShots: ShotKey[];
  // 구매 기록. 실물은 선택, 전자책은 판매처·주문번호·구매 내역·영수증이 필수다.
  purchase: {
    seller: string | null;
    captureUrl: string | null;
    receiptUrl: string | null;
    orderNumber: string | null;
    orderDate: string | null;
  };
  previousRejections: PreviousRejection[];
  // 신청할 때 낸 본문 퀴즈. 퀴즈 없이 낸 신청은 비어 있다.
  quiz?: { question: string; answer: string; page: string };
  status: CertStatus;
  flaggedShots?: ShotKey[];
  processedBy?: string;
  processedAt?: Date;
}

export interface QuizQuestion {
  id: string;
  rulebookId: string;
  question: string;
  answers: string[];
  page: string;
  active: boolean;
  askedCount: number;
}

export interface CertSeller {
  id: string;
  name: string;
}

export interface RulebookRequest {
  id: string;
  userId: string;
  name: string;
  bookName: string;
  edition: string;
  kind: RulebookKind | null;
  category: string | null;
  note: string;
  requestedAt: Date;
  similarTo?: string;
  processed?: { action: AuditAction; by: string; at: Date };
}

export interface Session {
  id: string;
  title: string;
  rulebook: string;
  rulebookId: string | null;
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
