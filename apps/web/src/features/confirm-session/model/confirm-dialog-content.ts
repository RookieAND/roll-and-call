import { firstConfirmWarning } from "./first-confirm-warning";

export const DIALOG_ROW_TONE = { new: "new", old: "old" } as const;
export type DialogRowTone = (typeof DIALOG_ROW_TONE)[keyof typeof DIALOG_ROW_TONE] | null;

export interface DialogRow {
  label: string;
  value: string;
  tone: DialogRowTone;
}

export interface ConfirmDialogContent {
  rows: DialogRow[];
  warning: string[] | null;
  note: string | null;
}

// 시안 03 2-A: 제목 아래 값 상자(행) → 경고 → 안내 한 줄.
export function confirmDialogContent({
  previousLabel,
  nextLabel,
  confirmedCount,
  maxPlayers,
}: {
  previousLabel: string | null;
  nextLabel: string;
  confirmedCount: number;
  maxPlayers: number;
}): ConfirmDialogContent {
  if (previousLabel) {
    return {
      rows: [
        { label: "이전", value: previousLabel, tone: DIALOG_ROW_TONE.old },
        { label: "새 시각", value: nextLabel, tone: DIALOG_ROW_TONE.new },
      ],
      warning: null,
      note:
        confirmedCount > 0
          ? `확정 참여자 ${confirmedCount}명에게 알림이 갑니다.`
          : "알릴 참여자가 없습니다.",
    };
  }
  const empty = confirmedCount === 0;
  const headcount = empty ? "0명" : `${confirmedCount} / ${maxPlayers}명`;
  return {
    rows: [
      { label: "세션 시간", value: nextLabel, tone: DIALOG_ROW_TONE.new },
      { label: "참여자", value: headcount, tone: null },
    ],
    warning: firstConfirmWarning({ confirmedCount, maxPlayers }),
    note: empty ? null : "확정 참여자에게 알림이 갑니다.",
  };
}
