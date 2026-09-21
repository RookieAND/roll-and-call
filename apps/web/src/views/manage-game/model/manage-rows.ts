import {
  countConfirmed,
  isDeadlinePassed,
  isDeadlineUrgent,
  isSessionEnded,
  SCHEDULE_MODE,
  splitRoster,
} from "@/entities/game";
import { formatDateTime } from "@/shared/lib";
import type { GameDetailData } from "@/shared/server";

export const MANAGE_ROW_STATE = {
  open: "open",
  warning: "warning",
  done: "done",
  // 지금 못 하는 일이다. 줄은 지우지 않고 흐리게 둔다.
  locked: "locked",
} as const;
export type ManageRowState = (typeof MANAGE_ROW_STATE)[keyof typeof MANAGE_ROW_STATE];

export type ManageRow = {
  key: "attendance" | "time" | "roster" | "edit";
  icon: "clipboard" | "clock" | "check" | "users" | "pencil";
  label: string;
  detail: string;
  href: string | null;
  state: ManageRowState;
  blocked: boolean;
};

// 줄 순서는 고정이다. 상태에 따라 순서를 바꾸지 않고 같은 자리에서 찾게 한다.
// 빨간 점은 지금 막혀 있는 줄에만, 둘 이상이면 위쪽 한 줄에만 단다.
export function manageRows(game: GameDetailData, responses: number, now = new Date()): ManageRow[] {
  const { confirmed, waiting } = splitRoster(game.participants);
  const confirmedCount = countConfirmed(game.participants);
  const ended = isSessionEnded(game, now);
  const coordinating = game.scheduleMode === SCHEDULE_MODE.coordinate && !game.confirmedAt;
  const overdue = coordinating && isDeadlinePassed(game.endDate, now);
  const unsubmitted = coordinating ? Math.max(confirmedCount - responses, 0) : 0;

  const open = { state: MANAGE_ROW_STATE.open, blocked: false } as const;
  const locked = { state: MANAGE_ROW_STATE.locked, href: null, blocked: false } as const;

  const attendanceBase = { key: "attendance", icon: "clipboard", label: "출석 확인" } as const;
  const attendance: ManageRow = !ended
    ? { ...attendanceBase, ...locked, detail: "아직 세션이 끝나지 않았습니다" }
    : game.attendanceConfirmedAt
      ? {
          ...attendanceBase,
          ...open,
          detail: "출석을 정리했습니다",
          href: `/games/${game.id}/attendance`,
          state: MANAGE_ROW_STATE.done,
        }
      : confirmedCount === 0
        ? { ...attendanceBase, ...locked, detail: "확정 참여자가 없습니다" }
        : {
            ...attendanceBase,
            ...open,
            detail: `확정 참여자 ${confirmedCount}명의 참석 여부가 비어 있습니다`,
            href: `/games/${game.id}/attendance`,
            blocked: true,
          };

  const time: ManageRow = game.confirmedAt
    ? {
        ...open,
        key: "time",
        icon: "check",
        label: "세션 시간 확정",
        detail: `${formatDateTime(game.confirmedAt)}으로 정했습니다`,
        href: null,
        state: MANAGE_ROW_STATE.done,
      }
    : {
        key: "time",
        icon: "clock",
        label: "세션 시간 확정",
        detail: overdue
          ? `기한이 지났습니다 · 응답 ${responses}/${confirmedCount}`
          : `응답 ${responses}/${confirmedCount} · 겹치는 시간에서 고릅니다`,
        href: `/games/${game.id}/confirm`,
        state: overdue ? MANAGE_ROW_STATE.warning : MANAGE_ROW_STATE.open,
        blocked: overdue,
      };

  const rosterBase = { key: "roster", icon: "users", label: "참여자 관리" } as const;
  const roster: ManageRow = ended
    ? { ...rosterBase, ...locked, detail: "끝난 세션은 명단을 고칠 수 없습니다" }
    : {
        ...rosterBase,
        ...open,
        detail: [
          `확정 ${confirmed.length}/${game.maxPlayers}`,
          waiting.length > 0 ? `대기 ${waiting.length}명` : "대기 없음",
          ...(unsubmitted > 0 ? [`${unsubmitted}명 미제출`] : []),
        ].join(" · "),
        href: `/games/${game.id}/participants`,
        blocked: !overdue && unsubmitted > 0 && isDeadlineUrgent(game.endDate, now),
      };

  const editBase = { key: "edit", icon: "pencil", label: "세션 수정" } as const;
  const edit: ManageRow = ended
    ? { ...editBase, ...locked, detail: "끝난 세션은 고칠 수 없습니다" }
    : {
        ...editBase,
        ...open,
        detail: "게임 정보 · 이미지 · 모집 조건",
        href: `/games/${game.id}/edit`,
      };

  return [attendance, time, roster, edit];
}
