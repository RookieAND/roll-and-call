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

// 일정 줄 글자색. 확정 일시는 진하게, 막힌 일·불참은 붉게, 나머지는 옅게.
export const SESSION_TONE = {
  strong: "strong",
  muted: "muted",
  warning: "warning",
  danger: "danger",
} as const;

export type SessionTone = (typeof SESSION_TONE)[keyof typeof SESSION_TONE];

// 일정 줄 앞 아이콘은 셋뿐이다: 정해진 날(달력) · 기다리는 중(시계) · 막힘(경고). 종료 카드도 달력을 단다.
export const SESSION_ICON = {
  calendar: "calendar",
  clock: "clock",
  alert: "alert",
} as const;

export type SessionIcon = (typeof SESSION_ICON)[keyof typeof SESSION_ICON];

export const SESSION_ACTION_KIND = {
  confirmTime: "confirm-time",
  submitAvailability: "submit-availability",
  reviewApplicants: "review-applicants",
  hostMenu: "host-menu",
  cancelWaitlist: "cancel-waitlist",
  confirmAttendance: "confirm-attendance",
  drawLottery: "draw-lottery",
  fillVacancy: "fill-vacancy",
} as const;

export type SessionActionKind = (typeof SESSION_ACTION_KIND)[keyof typeof SESSION_ACTION_KIND];

export type SessionAction = {
  kind: SessionActionKind;
  label: string;
  href: string;
};

// 할 일 카드. blocked는 지금 막혀 있는 일이라 카드를 붉게 칠하고 초록 버튼을 단다. 설명은 문장마다 한 줄.
export type SessionTodo = SessionAction & { lines: string[]; blocked: boolean };

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
  // 운영 탭은 내가 GM이라 적지 않는다.
  gm: { username: string; avatarUrl: string | null } | null;
  // 불참처럼 카드 제목까지 붉게 읽혀야 하는 끝.
  titleDanger: boolean;
  urgent: boolean;
  // 목록 카드가 다는 버튼. 운영은 언제나 "운영 관리" 하나다.
  action: SessionAction | null;
  // 지금 막혀 있는 것. 마이페이지 할 일 카드가 이걸로 만들어진다.
  todo: SessionTodo | null;
  waitingCount: number;
  // 참여 탭에서 내가 대기 중일 때의 순번. 추첨 발표 전·승인 대기는 순번이 없다.
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
  // 남의 프로필: 할 일 버튼과 보는 사람 기준 문구(미제출·응답 수)를 빼고 기록만 남긴다.
  readOnly?: boolean;
};

export type MySessions = Record<SessionRole, SessionCardModel[]>;
