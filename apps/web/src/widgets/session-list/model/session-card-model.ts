import type { ParticipantStatus, SessionRole } from "@/entities/game";
import type { Game, ReviewedGames } from "@/shared/server";

export const SESSION_CHIP = {
  scheduling: "scheduling",
  confirmed: "confirmed",
  waiting: "waiting",
  recruiting: "recruiting",
  ended: "ended",
} as const;

export type SessionChip = (typeof SESSION_CHIP)[keyof typeof SESSION_CHIP];

export const SESSION_TONE = {
  strong: "strong",
  muted: "muted",
  warning: "warning",
  danger: "danger",
} as const;

export type SessionTone = (typeof SESSION_TONE)[keyof typeof SESSION_TONE];

export const SESSION_ICON = {
  calendar: "calendar",
  clock: "clock",
  alert: "alert",
} as const;

export type SessionIcon = (typeof SESSION_ICON)[keyof typeof SESSION_ICON];

export const SESSION_ACTION_KIND = {
  confirmTime: "confirm-time",
  submitAvailability: "submit-availability",
  hostMenu: "host-menu",
  manageAttendance: "manage-attendance",
  viewSessionReviews: "view-session-reviews",
  cancelWaitlist: "cancel-waitlist",
  confirmAttendance: "confirm-attendance",
  fillVacancy: "fill-vacancy",
  writeReview: "write-review",
  viewReview: "view-review",
} as const;

export type SessionActionKind = (typeof SESSION_ACTION_KIND)[keyof typeof SESSION_ACTION_KIND];

export type SessionAction = {
  kind: SessionActionKind;
  label: string;
  href: string;
};

// sortAt은 같은 종류 안에서 가까운 순으로 세울 때 쓰는 시각(ISO)이다.
export type SessionTodoKind =
  | typeof SESSION_ACTION_KIND.confirmTime
  | typeof SESSION_ACTION_KIND.confirmAttendance
  | typeof SESSION_ACTION_KIND.fillVacancy
  | typeof SESSION_ACTION_KIND.submitAvailability;

export type SessionTodo = Omit<SessionAction, "kind"> & {
  kind: SessionTodoKind;
  lines: string[];
  blocked: boolean;
  sortAt: string;
  eyebrow?: string;
};

export type SessionCardModel = {
  id: string;
  title: string;
  role: SessionRole;
  chip: SessionChip;
  badge: string;
  badgeColor: "primary" | "success" | "warning" | "danger" | "gray";
  schedule: string;
  scheduleTone: SessionTone;
  scheduleIcon: SessionIcon;
  gm: { username: string; avatarUrl: string | null } | null;
  titleDanger: boolean;
  urgent: boolean;
  cancelled: boolean;
  // 운영진이 숨긴 구인을 보는 사람이 볼 수 없으면 제목만 가린 카드로 그린다(R4, 남의 세션 기록).
  hidden: boolean;
  action: SessionAction | null;
  // 끝나거나 취소된 내 구인을 같은 내용으로 다시 열 수 있다.
  canReopen?: boolean;
  caption: { text: string; strong: boolean } | null;
  todo: SessionTodo | null;
  waitingCount: number;
  waitlistRank: number | null;
  startsAt: string | null;
  deadlinePassed: boolean;
  sortKey: number;
};

type SessionParticipant = {
  userId: string;
  status: ParticipantStatus;
  joinedAt: Date | string;
  absent: boolean;
};

export type SessionGame = Game & {
  gm: { username: string; avatarUrl: string | null } | null;
  participants: SessionParticipant[];
};

export type SessionContext = {
  viewerId: string;
  respondedGameIds: ReadonlySet<string>;
  responseCounts: ReadonlyMap<string, number>;
  now?: Date;
  readOnly?: boolean;
  reviewedGames?: ReviewedGames;
};

export type MySessions = Record<SessionRole, SessionCardModel[]>;
