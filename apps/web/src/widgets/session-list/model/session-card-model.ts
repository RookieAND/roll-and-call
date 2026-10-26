import type { ReviewedGames } from "@roll-and-call/database/reviews";

import type { SessionRole } from "@/entities/game";

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
  // 데스크톱 카드 위의 16:9 썸네일. 스포일러면 회색 칸으로 가린다.
  thumbnailUrl: string | null;
  thumbnailSpoiler: boolean;
  isPrivate: boolean;
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

export type SessionContext = {
  viewerId: string;
  respondedGameIds: ReadonlySet<string>;
  responseCounts: ReadonlyMap<string, number>;
  now?: Date;
  readOnly?: boolean;
  reviewedGames?: ReviewedGames;
};

// 썸네일은 toSessionCard가 구인 행에서 한 번에 붙인다. 종류별 빌더는 이 나머지를 만든다.
export type SessionCardBase = Omit<
  SessionCardModel,
  "thumbnailUrl" | "thumbnailSpoiler" | "isPrivate"
>;

export type MySessions = Record<SessionRole, SessionCardModel[]>;
