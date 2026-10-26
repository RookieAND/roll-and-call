// 알림을 만드는 연결은 각 기능 묶음이 한다. 종류를 지우면 남은 행은 목록에서 건너뛴다.
import type { GameCancelKind } from "#db/modules/notifications/model/game-cancel-kind";

export const NOTIFICATION_KIND = {
  participationConfirmed: "participation_confirmed",
  movedToWaitlist: "moved_to_waitlist",
  removedFromRoster: "removed_from_roster",
  seatOpened: "seat_opened",
  participantLeft: "participant_left",
  drawWon: "draw_won",
  drawWaitlisted: "draw_waitlisted",
  lotteryScheduleConfirmed: "lottery_schedule_confirmed",
  lotteryParticipationConfirmed: "lottery_participation_confirmed",
  selectionScheduleConfirmed: "selection_schedule_confirmed",
  selectionParticipationConfirmed: "selection_participation_confirmed",
  selectionWaitlisted: "selection_waitlisted",
  recruitmentClosedEmpty: "recruitment_closed_empty",
  sessionTimeSet: "session_time_set",
  sessionTimeChanged: "session_time_changed",
  gameCancelled: "game_cancelled",
  gameHidden: "game_hidden",
  gameUnhidden: "game_unhidden",
  absenceRecorded: "absence_recorded",
  absenceAddedByStaff: "absence_added_by_staff",
  absenceCancelled: "absence_cancelled",
  absenceRestored: "absence_restored",
  attendanceAutoConfirmed: "attendance_auto_confirmed",
  reviewAvailable: "review_available",
  sessionReminder: "session_reminder",
  sessionStarted: "session_started",
  certApproved: "cert_approved",
  certRejected: "cert_rejected",
  certRevoked: "cert_revoked",
  certGranted: "cert_granted",
  rulebookRequestAdded: "rulebook_request_added",
  rulebookRequestDeclined: "rulebook_request_declined",
  reviewHidden: "review_hidden",
  reviewUnhidden: "review_unhidden",
  reviewDeleted: "review_deleted",
  sanctioned: "sanctioned",
  sanctionReleased: "sanction_released",
  nicknameChanged: "nickname_changed",
  staffAdded: "staff_added",
  staffRemoved: "staff_removed",
  badgeEarned: "badge_earned",
  hiddenTitleEarned: "hidden_title_earned",
  monthlyAward: "monthly_award",
  rankLeader: "rank_leader",
} as const;

export type NotificationKind = (typeof NOTIFICATION_KIND)[keyof typeof NOTIFICATION_KIND];

export const MONTHLY_AWARD_ROLE = { gm: "gm", pl: "pl" } as const;

export type MonthlyAwardRole = (typeof MONTHLY_AWARD_ROLE)[keyof typeof MONTHLY_AWARD_ROLE];

type GameParams = { gameId: string; gameTitle: string };
type WaitlistParams = GameParams & { waitlistRank: number };
type ReasonedGameParams = GameParams & { reason: string };
type EmptyParams = Record<string, never>;

// 날짜는 ISO 문자열이다. 구인 제목·룰북 이름·닉네임은 만들 때 값을 넣는다.
export type NotificationParamsMap = {
  participation_confirmed: GameParams;
  moved_to_waitlist: WaitlistParams;
  removed_from_roster: GameParams;
  seat_opened: GameParams;
  // nickname은 취소한 사람의 그 서버 닉네임(server_members.nickname, memberNicknameSql)이다. profiles.username을 넣지 않는다.
  participant_left: GameParams & { nickname: string };
  draw_won: GameParams;
  draw_waitlisted: WaitlistParams;
  lottery_schedule_confirmed: GameParams;
  lottery_participation_confirmed: GameParams;
  selection_schedule_confirmed: GameParams & { startsAt: string };
  selection_participation_confirmed: GameParams;
  selection_waitlisted: WaitlistParams;
  recruitment_closed_empty: GameParams;
  session_time_set: GameParams & { startsAt: string };
  session_time_changed: GameParams & { previousStartsAt: string; startsAt: string };
  game_cancelled: GameParams & { cancelKind: GameCancelKind; reason: string | null };
  game_hidden: ReasonedGameParams;
  game_unhidden: GameParams;
  absence_recorded: GameParams;
  absence_added_by_staff: GameParams;
  absence_cancelled: GameParams;
  absence_restored: GameParams;
  attendance_auto_confirmed: GameParams;
  review_available: GameParams;
  // 비공개 구인만 받는다. 공개 구인은 디스코드 스레드의 글로 안내한다. isGm이면 출석 확인으로, 아니면 구인 상세로 간다.
  session_reminder: GameParams;
  session_started: GameParams & { isGm: boolean };
  // otherCount는 한 묶음으로 함께 처리된 나머지 룰북 수다. 없거나 0이면 한 권이다.
  cert_approved: { rulebookId: string; rulebookName: string; otherCount?: number };
  cert_rejected: {
    rulebookId: string;
    rulebookName: string;
    rejectionSummary: string;
    otherCount?: number;
  };
  cert_revoked: { rulebookId: string; rulebookName: string; cancelledGameCount: number };
  // otherCount는 한 번에 함께 등록된 나머지 룰북 수다. 없거나 0이면 한 권이다.
  cert_granted: { rulebookId: string; rulebookName: string; otherCount?: number };
  rulebook_request_added: { rulebookName: string };
  rulebook_request_declined: { rulebookName: string };
  review_hidden: ReasonedGameParams;
  review_unhidden: GameParams;
  review_deleted: ReasonedGameParams;
  sanctioned: { reason: string; until: string | null };
  sanction_released: EmptyParams;
  // nickname은 운영진이 바꾼 그 서버 닉네임(server_members.nickname)이다.
  nickname_changed: { nickname: string; reason: string };
  staff_added: EmptyParams;
  staff_removed: EmptyParams;
  // criterion은 단계 기준 한 줄(예: 세션 10회 참석)
  badge_earned: { emoji: string; name: string; criterion: string };
  hidden_title_earned: { emoji: string; name: string; description: string };
  monthly_award: { month: number; role: MonthlyAwardRole };
  // 포인트제 서버에서 이 달의 기록 1위가 바뀌어 내가 1위가 되었을 때. month는 1~12다.
  // unit이 없으면 점수 기준, "count"면 참여 횟수 기준이다.
  rank_leader: { month: number; role: MonthlyAwardRole; unit?: "count" };
};

export type NotificationPayload = {
  [Kind in NotificationKind]: { kind: Kind; params: NotificationParamsMap[Kind] };
}[NotificationKind];

export type NotificationInput = NotificationPayload & { userId: string };
