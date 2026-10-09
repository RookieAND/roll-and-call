import { SESSION_ACTION_KIND, type SessionAction } from "./session-card-model";

// 끝난 내 구인은 출석을 확인하기 전엔 [출석 관리], 확인한 뒤엔 [후기 보기]를 단다.
export function hostPastAction({
  game,
  finished,
}: {
  game: { id: string; attendanceConfirmedAt: Date | string | null };
  finished: boolean;
}): SessionAction | null {
  if (!finished) return null;
  if (game.attendanceConfirmedAt) {
    return {
      kind: SESSION_ACTION_KIND.viewSessionReviews,
      label: "후기 보기",
      href: `/games/${game.id}/reviews`,
    };
  }
  return {
    kind: SESSION_ACTION_KIND.manageAttendance,
    label: "출석 관리",
    href: `/games/${game.id}/attendance`,
  };
}
