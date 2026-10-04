import { countConfirmed, isDeadlinePassed, isSessionEnded, SCHEDULE_MODE } from "@/entities/game";
import { reviewWriteDeadline } from "@/entities/review";
import { formatDate, formatDateTime } from "@/shared/lib";
import type { GameDetailData } from "@/shared/server";

import { attendanceRow } from "./attendance-row";
import { MANAGE_ROW_STATE, type ManageRow } from "./manage-row-state";

// 줄 순서는 고정이다. 상태에 따라 순서를 바꾸지 않고 같은 자리에서 찾게 한다.
export function manageRows({
  game,
  reviewCount,
  now = new Date(),
}: {
  game: GameDetailData;
  reviewCount: number;
  now?: Date;
}): ManageRow[] {
  const confirmedCount = countConfirmed(game.participants);
  const ended = isSessionEnded(game, now);
  const coordinating = game.scheduleMode === SCHEDULE_MODE.coordinate && !game.confirmedAt;
  const overdue = coordinating && isDeadlinePassed(game.endDate, now);

  const open = { state: MANAGE_ROW_STATE.open } as const;
  const locked = { state: MANAGE_ROW_STATE.locked, href: null } as const;

  const attendance = attendanceRow({ game, ended, confirmedCount });

  const reviewBase = {
    key: "review",
    icon: "message",
    label: "세션 후기",
    href: `/games/${game.id}/reviews`,
  } as const;
  const reviewDeadline = game.attendanceConfirmedAt
    ? reviewWriteDeadline(game.attendanceFirstConfirmedAt ?? game.attendanceConfirmedAt)
    : null;
  const review: ManageRow = !reviewDeadline
    ? {
        ...reviewBase,
        ...locked,
        detail: ended ? "출석 확인 후 열립니다" : "세션이 끝나고 출석을 확인하면 열립니다",
      }
    : {
        ...reviewBase,
        ...open,
        detail:
          reviewDeadline.getTime() > now.getTime()
            ? `후기 ${reviewCount}개가 달렸습니다 · ${formatDate(reviewDeadline)}까지 받습니다`
            : `후기 ${reviewCount}개가 달렸습니다`,
      };

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

  return [attendance, review, time, roster, edit];
}
