import type { RulebookKind } from "@roll-and-call/database";
import type {
  AuditAction,
  AuditActorKind,
  AuditState,
  Sanction,
  ShotKey,
  StaffRole,
} from "@roll-and-call/database/moderation";

import type { MembershipStatus } from "@/shared/lib";

import type { PostStatus } from "./post-status";

export type {
  Actor,
  AuditState,
  Sanction,
  ShotKey,
  StaffRole,
} from "@roll-and-call/database/moderation";

export interface Staff {
  userId: string;
  nickname: string;
  role: StaffRole;
  discordId?: string;
  since: Date;
}

export interface AdminUser {
  id: string;
  nickname: string;
  discordId: string;
  discordHandle: string;
  joinedAt: Date;
  // 그 서버에 처음 가입한 날(server_members.joined_at). 다시 가입해도 바뀌지 않는다.
  memberJoinedAt: Date;
  hostedCount: number;
  recentHostedCount: number;
  sanction?: Sanction;
  membership: MembershipStatus;
  ban?: { at: Date; by: string; reason: string };
  rejoinedAt?: Date;
  leftAt?: Date;
}

export interface Rulebook {
  id: string;
  name: string;
  edition: string;
  category: string;
  categoryAlias: string | null;
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

// withdrawn은 신청자가 심사 전에 거둔 신청이다.
export type CertStatus = "pending" | "approved" | "rejected" | "withdrawn";

export interface PreviousRejection {
  rejectedAt: Date;
  tags: string[];
  requests: string[];
  flaggedShots: ShotKey[];
  photoUrls: Partial<Record<ShotKey, string>>;
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
  // 신청 없이 운영진이 준 인증이거나, 그 인증을 반려로 돌린 기록이다.
  direct: boolean;
  rejectReason?: string;
  appliedAt: Date;
  memo: string;
  photoUrls: Partial<Record<ShotKey, string>>;
  replacedShots: ShotKey[];
  purchase: {
    seller: string | null;
    captureUrl: string | null;
    receiptUrl: string | null;
    orderNumber: string | null;
    orderDate: string | null;
  };
  previousRejections: PreviousRejection[];
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
  filledAt?: Date;
  recruitMethod?: string;
  recruitDeadline?: Date;
  playTime?: string;
  genres?: string[];
  triggers?: string[];
  platforms?: string[];
  aiImage?: boolean;
  kindLabel?: string;
  playTypeLabel?: string;
  joinedAt?: Map<string, Date>;
  synopsis?: string;
  notices?: string[];
  imageUrls?: string[];
  thumbnailUrl?: string;
  attendanceConfirmedAt?: Date;
  attendanceFirstConfirmedAt?: Date;
  attendanceAutoConfirmed?: boolean;
  hidden?: { reason: string; by: string; at: Date };
  cancelled?: boolean;
  // 운영진 취소를 막는 이유(cancelBlockReason). 없으면 null.
  cancelBlock?: "already_cancelled" | "session_started" | null;
  sessionStarted?: boolean;
  // 운영진이 취소하면 game_cancelled 알림을 받는 사람(gameCancelledRecipients, GM 포함).
  staffCancelRecipientIds?: string[];
  // 세션이 끝나는 시각(isSessionEnded와 같은 기준). 일시가 정해지지 않았으면 null.
  endsAt?: Date | null;
  // ponytail: games에 수정 시각 칸이 없어 아직 채우지 않는다(R42). 칸이 생기면 hidden_at 뒤의 수정 시각을 넣는다.
  editedSinceHiddenAt?: Date;
}

export interface Review {
  id: string;
  sessionId: string;
  authorId: string;
  body: string;
  spoiler: boolean;
  photoUrls: string[];
  createdAt: Date;
  editedAt?: Date;
  hidden?: { reason: string; by: string; at: Date };
  removed?: { reason: string; by: string; at: Date };
  held: boolean;
}

export interface NoShow {
  id: string;
  userId: string;
  sessionId: string;
  cancelled: boolean;
  cancelledBy?: string;
  cancelledAt?: Date;
  cancelReason?: string;
  gmReason?: string;
  // 운영진이 추가한 기록. 사유는 태그 이름이고 기타면 입력한 글자다.
  added?: { by: string; at: Date; reason: string };
}

export interface AuditEntry {
  id: string;
  at: Date;
  actor: string;
  actorId?: string;
  actorKind: AuditActorKind;
  action: AuditAction;
  target: string;
  targetUserId?: string;
  targetGameId?: string;
  // 기록에 따로 남지 않아 대상(후기 작성자·구인, 룰북 이름)으로 찾은 ID다. 지워진 대상이면 없다.
  reviewId?: string;
  rulebookId?: string;
  reason: string;
  reasonTag?: string;
  staffMemo?: string;
  before?: AuditState;
  after?: AuditState;
  related?: string[];
}

export interface StaffMemo {
  id: string;
  userId: string;
  authorId: string | null;
  author: string;
  at: Date;
  body: string;
}
