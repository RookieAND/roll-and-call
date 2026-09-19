import type { ParticipantStatus, SessionRole } from "@/entities/game";
import type { Game } from "@/shared/server";

// 탭은 역할만 가르고 진행·종료은 칩이 가른다. 세션이 끝나도 내가 GM이었는지는 바뀌지 않는다.
export const SESSION_CHIP = {
  scheduling: "scheduling",
  confirmed: "confirmed",
  waiting: "waiting",
  recruiting: "recruiting",
  ended: "ended",
} as const;

export type SessionChip = (typeof SESSION_CHIP)[keyof typeof SESSION_CHIP];

export const SESSION_TONE = {
  normal: "normal",
  success: "success",
  warning: "warning",
  hint: "hint",
} as const;

export type SessionTone = (typeof SESSION_TONE)[keyof typeof SESSION_TONE];

export const SESSION_ACTION_KIND = {
  confirmTime: "confirm-time",
  submitAvailability: "submit-availability",
  reviewApplicants: "review-applicants",
  hostMenu: "host-menu",
  cancelWaitlist: "cancel-waitlist",
} as const;

export type SessionActionKind = (typeof SESSION_ACTION_KIND)[keyof typeof SESSION_ACTION_KIND];

export type SessionAction = {
  kind: SessionActionKind;
  label: string;
  href: string;
};

export type SessionCardModel = {
  id: string;
  title: string;
  role: SessionRole;
  chip: SessionChip;
  badge: string;
  badgeColor: "primary" | "success" | "gray";
  schedule: string;
  scheduleTone: SessionTone;
  meta: string;
  urgent: boolean;
  // 목록 카드가 다는 버튼. 운영은 언제나 "운영 관리" 하나다.
  action: SessionAction | null;
  // 지금 막혀 있는 것. 마이페이지 할 일 카드가 이걸로 만들어진다.
  todo: SessionAction | null;
  waitingCount: number;
  startsAt: string | null;
  deadlinePassed: boolean;
  sortKey: number;
};

type SessionParticipant = {
  userId: string;
  status: ParticipantStatus;
  joinedAt: Date | string;
};

export type SessionGame = Game & {
  gm: { username: string } | null;
  participants: SessionParticipant[];
};

export type SessionContext = {
  viewerId: string;
  respondedGameIds: ReadonlySet<string>;
  responseCounts: ReadonlyMap<string, number>;
  now?: Date;
  // 남의 프로필: 할 일 버튼과 보는 사람 기준 문구(미제출·응답 수)를 빼고 기록만 남긴다.
  readOnly?: boolean;
};

export type MySessions = Record<SessionRole, SessionCardModel[]>;
