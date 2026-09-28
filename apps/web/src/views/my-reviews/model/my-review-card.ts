import { deriveReviewState, REVIEW_STATE, reviewEditDeadline } from "@/entities/review";
import { ddayKst, formatMonthDay } from "@/shared/lib";
import type { MyReviewRow } from "@/shared/server";

type Palette = "primary" | "gray" | "warning" | "danger";

export const MY_REVIEW_ACTIONS = {
  editAndDelete: "edit-and-delete",
  delete: "delete",
  none: "none",
} as const;

export type MyReviewActions = (typeof MY_REVIEW_ACTIONS)[keyof typeof MY_REVIEW_ACTIONS];

export type MyReviewCardModel = {
  id: string;
  title: string;
  meta: string;
  body: string | null;
  bodyMuted: boolean;
  badge: { label: string; palette: Palette } | null;
  callout: { palette: Palette; title: string; lines: string[] } | null;
  actions: MyReviewActions;
  editHref: string;
  subject: string;
};

// 공개는 수정 기한 배지만, 막힌 상태는 배지와 까닭 상자를 단다. 버튼은 상태가 허락하는 것만 둔다.
export function toMyReviewCard(row: MyReviewRow, now: Date = new Date()): MyReviewCardModel {
  const state = deriveReviewState(row, now);
  const sessionDate = row.sessionAt ? formatMonthDay(row.sessionAt) : formatMonthDay(row.createdAt);
  const base = {
    id: row.id,
    title: row.gameTitle,
    meta: `${row.gameRule} · ${sessionDate}${row.updatedAt ? " · 수정됨" : ""}`,
    body: row.body,
    bodyMuted: true,
    badge: null,
    callout: null,
    editHref: `/games/${row.gameId}/review`,
    subject: `${row.gameTitle} · ${sessionDate} 세션`,
  };

  switch (state) {
    case REVIEW_STATE.editable: {
      const days = ddayKst(reviewEditDeadline(row.createdAt), now);
      const label = days > 0 ? `수정 D-${days}` : "수정 오늘까지";
      return {
        ...base,
        bodyMuted: false,
        badge: { label, palette: "primary" },
        actions: MY_REVIEW_ACTIONS.editAndDelete,
      };
    }
    case REVIEW_STATE.locked:
      return { ...base, bodyMuted: false, actions: MY_REVIEW_ACTIONS.delete };
    case REVIEW_STATE.held:
      return {
        ...base,
        badge: { label: "보류", palette: "gray" },
        callout: { palette: "gray", title: "불참으로 바뀌어 비공개됐습니다", lines: [] },
        actions: MY_REVIEW_ACTIONS.delete,
      };
    case REVIEW_STATE.hidden:
      return {
        ...base,
        badge: { label: "숨김", palette: "warning" },
        callout: {
          palette: "warning",
          title: "운영진이 숨긴 후기입니다",
          lines: [
            ...(row.hiddenReason ? [`사유: ${row.hiddenReason}`] : []),
            "고친 뒤 디스코드로 해제를 요청해 주세요.",
          ],
        },
        actions: MY_REVIEW_ACTIONS.editAndDelete,
      };
    case REVIEW_STATE.removed:
      return {
        ...base,
        body: null,
        badge: { label: "삭제됨", palette: "danger" },
        callout: {
          palette: "danger",
          title: "운영진이 삭제한 후기입니다",
          lines: row.removedReason ? [`사유: ${row.removedReason}`] : [],
        },
        actions: MY_REVIEW_ACTIONS.none,
      };
  }
}
