import { isNil } from "es-toolkit";

import { countConfirmed, isSessionEnded, isSessionStarted } from "@/entities/game";
import { reviewWriteDeadline } from "@/entities/review";
import { formatDate } from "@/shared/lib";
import type { GameDetailData } from "@/shared/server";

import { attendanceRow } from "./attendance-row";
import { MANAGE_ROW_STATE, type ManageRow } from "./manage-row-state";
import { timeRow } from "./time-row";

export const CANCELLED_ROW_DETAIL = "취소한 구인입니다";

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
  const ended = isSessionEnded(game, now);
  const started = isSessionStarted(game, now);
  const open = { state: MANAGE_ROW_STATE.open } as const;
  const locked = { state: MANAGE_ROW_STATE.locked, href: null } as const;

  const attendance = attendanceRow({
    game,
    confirmedCount: countConfirmed(game.participants),
    now,
  });

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

  const rosterBase = { key: "roster", icon: "users", label: "참여자 관리" } as const;
  const roster: ManageRow = ended
    ? { ...rosterBase, ...locked, detail: "끝난 세션은 명단을 고칠 수 없습니다" }
    : {
        ...rosterBase,
        ...open,
        detail: "확정·대기 옮기기, 참여자 추가, 내보내기를 합니다",
        href: `/games/${game.id}/participants`,
      };

  const editBase = { key: "edit", icon: "pencil", label: "구인 수정" } as const;
  const edit: ManageRow = started
    ? { ...editBase, ...locked, detail: "시작한 세션은 고칠 수 없습니다" }
    : {
        ...editBase,
        ...open,
        detail: "구인 글의 제목과 소개, 이미지, 모집 조건을 고칩니다",
        href: `/games/${game.id}/edit`,
      };

  const rows = [attendance, review, timeRow({ game, now }), roster, edit];
  if (isNil(game.cancelledAt)) return rows;
  return rows.map((row) => ({
    key: row.key,
    icon: row.icon === "check" ? "clock" : row.icon,
    label: row.key === "time" ? "세션 시간 정하기" : row.label,
    ...locked,
    detail: CANCELLED_ROW_DETAIL,
  }));
}
