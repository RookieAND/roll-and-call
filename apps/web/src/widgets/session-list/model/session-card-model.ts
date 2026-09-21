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
  danger: "danger",
  hint: "hint",
} as const;

export type SessionTone = (typeof SESSION_TONE)[keyof typeof SESSION_TONE];

// 일정 줄 앞 아이콘. 색은 tone이 맡고, 무슨 일이 걸려 있는지는 아이콘이 말한다.
export const SESSION_ICON = {
  confirmed: "confirmed",
  alert: "alert",
  scheduling: "scheduling",
  deadline: "deadline",
  waitlist: "waitlist",
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

// 카드 아래 줄의 숫자 칩. label이 없으면 값만 적는다(정원 3/4).
// 사람을 세는 칩만 인원 아이콘을 단다 — 대기 순번은 사람 수가 아니다.
export type SessionCount = { label: string | null; value: string; icon?: boolean };

export type SessionAction = {
  kind: SessionActionKind;
  label: string;
  href: string;
};

// 할 일 카드. blocked는 지금 막혀 있는 일이라 카드를 붉게 칠하고 초록 버튼을 단다.
export type SessionTodo = SessionAction & { description: string; blocked: boolean };

export type SessionCardModel = {
  id: string;
  title: string;
  role: SessionRole;
  chip: SessionChip;
  badge: string;
  badgeColor: "primary" | "success" | "warning" | "danger" | "gray";
  schedule: string;
  // 확정 시각 뒤에 붙는 "모레" — 강조에서 빠져 회색으로 남는다.
  scheduleTail: string | null;
  scheduleTone: SessionTone;
  scheduleIcon: SessionIcon | null;
  rule: string;
  // 운영 탭은 내가 GM이라 적지 않는다.
  gm: { username: string; avatarUrl: string | null } | null;
  counts: SessionCount[];
  // 카드 아래에 한 겹 더 붙는 설명. 지금은 불참 기록이 언제 사라지는지 뿐이다.
  note: string | null;
  urgent: boolean;
  // 목록 카드가 다는 버튼. 운영은 언제나 "운영 관리" 하나다.
  action: SessionAction | null;
  // 지금 막혀 있는 것. 마이페이지 할 일 카드가 이걸로 만들어진다.
  todo: SessionTodo | null;
  waitingCount: number;
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
