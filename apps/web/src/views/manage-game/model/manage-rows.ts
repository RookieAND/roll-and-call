import type { GameDetailData } from "@roll-and-call/database/games";
import { isNil } from "es-toolkit";

import { countConfirmed, isSessionEnded, isSessionStarted } from "@/entities/game";
import { reviewWriteDeadline } from "@/entities/review";

import { attendanceRow } from "./attendance-row";
import { endSessionRow } from "./end-session-row";
import { gmReviewRow } from "./gm-review-button";
import type { ManageReviewButton } from "./manage-review-button";
import { MANAGE_ROW_STATE, type ManageRow } from "./manage-row-state";
import { timeRow } from "./time-row";

export const CANCELLED_ROW_DETAIL = "취소한 구인입니다";

export type ManageRowGroups = {
  progress: ManageRow[];
  management: ManageRow[];
  review: ManageRow[];
};

// 줄 순서는 고정이다. 상태에 따라 순서를 바꾸지 않고 같은 자리에서 찾게 한다.
export function manageRowGroups({
  game,
  reviewCount,
  gmReview = null,
  now = new Date(),
}: {
  game: GameDetailData;
  reviewCount: number;
  gmReview?: ManageReviewButton | null;
  now?: Date;
}): ManageRowGroups {
  const ended = isSessionEnded(game, now);
  const started = isSessionStarted(game, now);
  const confirmedCount = countConfirmed(game.participants);

  const progress = [
    timeRow({ game, now }),
    attendanceRow({ game, confirmedCount, now }),
    endSessionRow({ game, confirmedCount, now }),
  ];

  const reviewBase: ManageRow = started
    ? {
        key: "review",
        icon: "message",
        label: "세션 후기 보기",
        detail: reviewCount > 0 ? `후기 ${reviewCount}개` : "아직 후기가 없습니다",
        href: `/games/${game.id}/reviews`,
        state: MANAGE_ROW_STATE.open,
      }
    : {
        key: "review",
        icon: "message",
        label: "세션 후기",
        detail: "세션이 시작되면 열립니다",
        href: null,
        state: MANAGE_ROW_STATE.locked,
      };
  const reviewDeadline = started ? reviewWriteDeadline(game) : null;
  const masteringRow = reviewDeadline
    ? gmReviewRow({ gmReview, gameId: game.id, deadline: reviewDeadline })
    : null;
  const review = masteringRow ? [reviewBase, masteringRow] : [reviewBase];

  const management: ManageRow[] = [
    ended
      ? {
          key: "roster",
          icon: "users",
          label: "참여자 관리",
          detail: "끝난 세션은 명단을 고칠 수 없습니다",
          href: null,
          state: MANAGE_ROW_STATE.locked,
        }
      : {
          key: "roster",
          icon: "users",
          label: "참여자 관리",
          detail: "명단 옮기기·추가·내보내기",
          href: `/games/${game.id}/participants`,
          state: MANAGE_ROW_STATE.open,
        },
    started
      ? {
          key: "edit",
          icon: "pencil",
          label: "구인 수정",
          detail: "시작한 세션은 고칠 수 없습니다",
          href: null,
          state: MANAGE_ROW_STATE.locked,
        }
      : {
          key: "edit",
          icon: "pencil",
          label: "구인 수정",
          detail: "제목·소개·이미지·모집 조건을 고칩니다",
          href: `/games/${game.id}/edit`,
          state: MANAGE_ROW_STATE.open,
        },
  ];

  if (isNil(game.cancelledAt)) return { progress, management, review };
  return {
    progress: progress.map((row) =>
      cancelledRow(row, row.key === "time" ? "세션 시간 정하기" : row.label),
    ),
    management: management.map((row) => cancelledRow(row, row.label)),
    review: [cancelledRow(reviewBase, "세션 후기")],
  };
}

function cancelledRow(row: ManageRow, label: string): ManageRow {
  return {
    key: row.key,
    icon: row.icon,
    label,
    detail: CANCELLED_ROW_DETAIL,
    href: null,
    state: MANAGE_ROW_STATE.locked,
  };
}
