import { countConfirmed, isDeadlinePassed, isSessionEnded, SCHEDULE_MODE } from "@/entities/game";
import { formatDateTime } from "@/shared/lib";
import type { GameDetailData } from "@/shared/server";

export const MANAGE_ROW_STATE = {
  open: "open",
  // 지금 막혀 있는 일이다. 줄 전체를 붉게 칠하고 무엇을 해야 하는지 적는다.
  blocked: "blocked",
  done: "done",
  // 지금 못 하는 일이다. 줄은 지우지 않고 흐리게 두고 이유를 적는다.
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
};

// 줄 순서는 고정이다. 상태에 따라 순서를 바꾸지 않고 같은 자리에서 찾게 한다.
// 숫자는 헤더에서만 읽는다 — 줄에는 그 줄이 여는 화면이 무엇을 하는지만 적는다.
export function manageRows(game: GameDetailData, now = new Date()): ManageRow[] {
  const confirmedCount = countConfirmed(game.participants);
  const ended = isSessionEnded(game, now);
  const coordinating = game.scheduleMode === SCHEDULE_MODE.coordinate && !game.confirmedAt;
  const overdue = coordinating && isDeadlinePassed(game.endDate, now);

  const open = { state: MANAGE_ROW_STATE.open } as const;
  const locked = { state: MANAGE_ROW_STATE.locked, href: null } as const;

  const attendanceBase = {
    key: "attendance",
    icon: "clipboard",
    label: "출석 확인",
    href: `/games/${game.id}/attendance`,
  } as const;
  const attendance: ManageRow = !ended
    ? { ...attendanceBase, ...locked, detail: "세션이 끝난 뒤에 쓸 수 있습니다" }
    : game.attendanceConfirmedAt
      ? { ...attendanceBase, state: MANAGE_ROW_STATE.done, detail: "출석을 정리했습니다" }
      : confirmedCount === 0
        ? { ...attendanceBase, ...locked, detail: "확정 참여자가 없습니다" }
        : { ...attendanceBase, ...open, detail: "세션이 끝났습니다 · 참석·불참을 표시해주세요" };

  const timeBase = { key: "time", label: "세션 시간 정하기" } as const;
  const time: ManageRow = game.confirmedAt
    ? {
        ...timeBase,
        icon: "check",
        detail: `${formatDateTime(game.confirmedAt)}으로 정했습니다`,
        href: null,
        state: MANAGE_ROW_STATE.done,
      }
    : {
        ...timeBase,
        icon: "clock",
        detail: overdue
          ? "조율 기한이 지났습니다 · 세션 일시를 빨리 정해주세요"
          : "받은 가능 시간을 겹쳐 보고 세션 일시를 정합니다",
        href: `/games/${game.id}/confirm`,
        state: overdue ? MANAGE_ROW_STATE.blocked : MANAGE_ROW_STATE.open,
      };

  const rosterBase = { key: "roster", icon: "users", label: "참여자 관리" } as const;
  const roster: ManageRow = ended
    ? { ...rosterBase, ...locked, detail: "끝난 세션은 명단을 고칠 수 없습니다" }
    : {
        ...rosterBase,
        ...open,
        detail: "신청 승인과 거절, 대기 순번, 내보내기를 합니다",
        href: `/games/${game.id}/participants`,
      };

  const editBase = { key: "edit", icon: "pencil", label: "세션 수정" } as const;
  const edit: ManageRow = ended
    ? { ...editBase, ...locked, detail: "끝난 세션은 고칠 수 없습니다" }
    : {
        ...editBase,
        ...open,
        detail: "구인 글의 제목과 소개, 이미지, 모집 조건을 고칩니다",
        href: `/games/${game.id}/edit`,
      };

  return [attendance, time, roster, edit];
}
