import { countConfirmed, isDeadlinePassed, SCHEDULE_MODE, splitRoster } from "@/entities/game";
import type { GameDetailData } from "@/shared/server";

export type ManageRow = {
  key: "time" | "roster" | "edit";
  icon: "clock" | "check" | "users" | "pencil";
  label: string;
  detail: string;
  href: string;
  tone: "normal" | "warning" | "success";
  blocked: boolean;
};

// 줄 순서는 고정이다. 상태에 따라 순서를 바꾸지 않고 같은 자리에서 찾게 한다.
export function manageRows(game: GameDetailData, responses: number, now = new Date()): ManageRow[] {
  const { confirmed, waiting } = splitRoster(game.participants);
  const confirmedCount = countConfirmed(game.participants);
  const deadlinePassed = isDeadlinePassed(game.endDate, now);
  const coordinate = game.scheduleMode === SCHEDULE_MODE.coordinate;
  const timeSet = Boolean(game.confirmedAt);
  const overdue = coordinate && !timeSet && deadlinePassed;

  const time: ManageRow = timeSet
    ? {
        key: "time",
        icon: "check",
        label: "세션 시간",
        detail: "확정되었습니다",
        href: `/games/${game.id}/schedule`,
        tone: "success",
        blocked: false,
      }
    : {
        key: "time",
        icon: "clock",
        label: "세션 시간 확정",
        detail: overdue
          ? `기한이 지났습니다 · 응답 ${responses}/${confirmedCount}`
          : `응답 ${responses}/${confirmedCount} · 겹치는 시간에서 고릅니다`,
        href: `/games/${game.id}/schedule`,
        tone: overdue ? "warning" : "normal",
        blocked: overdue,
      };

  const roster: ManageRow = {
    key: "roster",
    icon: "users",
    label: "참여자 관리",
    detail: `확정 ${confirmed.length}/${game.maxPlayers} · ${
      waiting.length > 0 ? `대기 ${waiting.length}명` : "대기 없음"
    }`,
    href: `/games/${game.id}/participants`,
    tone: "normal",
    // 빨간 점은 위쪽 한 줄에만 단다.
    blocked: !overdue && waiting.length > 0,
  };

  return [
    time,
    roster,
    {
      key: "edit",
      icon: "pencil",
      label: "세션 수정",
      detail: "게임 정보 · 이미지 · 모집 조건",
      href: `/games/${game.id}/edit`,
      tone: "normal",
      blocked: false,
    },
  ];
}
