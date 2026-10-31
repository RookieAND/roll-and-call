import type { Game } from "@roll-and-call/database";

import type { ConfirmedLeaveBlock, GameCancelKind, ParticipantStatus } from "@/entities/game";

import type { ReviewStatus } from "./review-status";

// 하단 바 상태(W02 작업 3의 표). 위에서부터 먼저 맞는 한 줄이 보이고, kind마다 컴포넌트 하나가 그린다.
export const GAME_ACTION_VIEW = {
  cancelled: "cancelled",
  gmEnded: "gmEnded",
  gmLive: "gmLive",
  gmUpcoming: "gmUpcoming",
  absent: "absent",
  endedParticipant: "endedParticipant",
  endedOther: "endedOther",
  lotteryApplied: "lotteryApplied",
  selectionApplied: "selectionApplied",
  waiting: "waiting",
  scheduled: "scheduled",
  confirmedOpen: "confirmedOpen",
  confirmedLocked: "confirmedLocked",
  closedScheduled: "closedScheduled",
  closed: "closed",
  closedPrivate: "closedPrivate",
  sanctioned: "sanctioned",
  conditionsUnmet: "conditionsUnmet",
  joinWaitlist: "joinWaitlist",
  join: "join",
  joinLottery: "joinLottery",
  joinSelection: "joinSelection",
} as const;

export type ActionGame = Pick<
  Game,
  | "scheduleMode"
  | "recruitMethod"
  | "confirmedAt"
  | "endDate"
  | "drawnAt"
  | "selectionFinishedAt"
  | "cancelledAt"
  | "cancelKind"
  | "cancelReason"
  | "playMinutes"
  | "endedAt"
  | "attendanceConfirmedAt"
  | "attendanceFirstConfirmedAt"
  | "maxPlayers"
  | "waitlistEnabled"
  | "visibility"
>;

export interface ActionViewer {
  isGm: boolean;
  status: ParticipantStatus | null;
  absent: boolean;
  absenceCancelledAt: Date | null;
  waitlistRank: number | null;
}

export interface ActionSanction {
  reason: string;
  until: Date | null;
}

export interface ActionContext {
  game: ActionGame;
  viewer: ActionViewer;
  confirmedCount: number;
  waitingCount: number;
  // 굴린 추첨이 실제로 있었는지. 신청자가 자리 이하라 추첨 없이 확정된 구인은 false라 [결과 보러 가기]를 두지 않는다.
  lotteryHeld: boolean;
  sanction: ActionSanction | null;
  // 참여 조건 가운데 내가 못 채운 것의 안내 문장. 조건이 없거나 다 채웠으면 비어 있다.
  unmetLines: string[];
  // 못 채운 조건에 룰북 인증이 들어 있는지. 인증하러 가는 버튼을 붙인다.
  certUnmet: boolean;
  review: ReviewStatus;
  now: Date;
}

// 조율형은 [일정 조율]·[일정 보기], 추첨 뒤에는 [결과 보러 가기]를 붙인다. [캘린더에 추가]는 canAddToCalendar로만 정한다.
export interface ActionLinks {
  resultLink: boolean;
  scheduleLink: boolean;
  calendar: boolean;
}

export type GameActionView =
  | {
      kind: typeof GAME_ACTION_VIEW.cancelled;
      cancelKind: GameCancelKind;
      reason: string | null;
      isGm: boolean;
    }
  | {
      kind: typeof GAME_ACTION_VIEW.gmEnded;
      attendanceDue: boolean;
      attendanceRecorded: boolean;
      endedOn: Date;
      review: ReviewStatus;
      // 마스터링 후기를 쓸 수 있을 때만 남은 일수(KST 날짜 차이)를 담는다.
      reviewDaysLeft: number | null;
    }
  | {
      kind: typeof GAME_ACTION_VIEW.gmLive;
      attendanceExpected: boolean;
      // 진행 중에 출석을 이미 확정했다.
      attendanceRecorded: boolean;
    }
  | { kind: typeof GAME_ACTION_VIEW.gmUpcoming; calendar: boolean }
  | { kind: typeof GAME_ACTION_VIEW.absent }
  | {
      kind: typeof GAME_ACTION_VIEW.endedParticipant;
      endedOn: Date;
      attendanceConfirmed: boolean;
      review: ReviewStatus;
    }
  | { kind: typeof GAME_ACTION_VIEW.endedOther }
  | {
      kind: typeof GAME_ACTION_VIEW.lotteryApplied;
      endDate: Date;
      closed: boolean;
      confirmsAll: boolean;
    }
  | { kind: typeof GAME_ACTION_VIEW.selectionApplied; endDate: Date; closed: boolean }
  | { kind: typeof GAME_ACTION_VIEW.waiting; rank: number; resultLink: boolean; selection: boolean }
  | ({
      kind: typeof GAME_ACTION_VIEW.scheduled;
      confirmedAt: Date;
      live: boolean;
      // 진행 중에만 의미가 있다. 시작 시각부터 후기를 쓸 수 있다.
      review: ReviewStatus;
    } & ActionLinks)
  | ({ kind: typeof GAME_ACTION_VIEW.confirmedOpen; confirmedAt: Date | null } & ActionLinks)
  | ({
      kind: typeof GAME_ACTION_VIEW.confirmedLocked;
      block: Exclude<ConfirmedLeaveBlock, "schedule">;
    } & ActionLinks)
  | { kind: typeof GAME_ACTION_VIEW.closedScheduled; confirmedAt: Date }
  | { kind: typeof GAME_ACTION_VIEW.closed }
  | { kind: typeof GAME_ACTION_VIEW.closedPrivate }
  | ({ kind: typeof GAME_ACTION_VIEW.sanctioned } & ActionSanction)
  | { kind: typeof GAME_ACTION_VIEW.conditionsUnmet; lines: string[]; certUnmet: boolean }
  | { kind: typeof GAME_ACTION_VIEW.joinWaitlist; nextRank: number }
  | { kind: typeof GAME_ACTION_VIEW.join }
  | { kind: typeof GAME_ACTION_VIEW.joinLottery; endDate: Date }
  | { kind: typeof GAME_ACTION_VIEW.joinSelection; endDate: Date };
