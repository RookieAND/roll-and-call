import type { GameRoundRow } from "@roll-and-call/database/games";
import { isRoundOpen, roundEndAt } from "@roll-and-call/database/games/model";
import { isNil } from "es-toolkit";

import { MANAGE_ROW_ACTION, MANAGE_ROW_STATE, type ManageRow } from "./manage-row-state";
import { nextRoundLabel } from "./next-round-label";

// 다회차 운영 관리의 「세션 진행」 줄: 회차 일정, 가장 최근 회차 출석 확인, 진행 중인 회차 마치기.
// 운영 관리에는 회차 목록을 늘어놓지 않고 회차 일정 화면으로 보낸다.
export function multiRoundProgressRows({
  game,
  rounds,
  now,
}: {
  game: {
    id: string;
    roundCount: number;
    finishedAt: Date | null;
    cancelledAt: Date | null;
    roundScheduleKind: string;
  };
  rounds: readonly GameRoundRow[];
  now: Date;
}): ManageRow[] {
  const started = rounds.filter((round) => !isNil(round.startAt) && round.startAt <= now);
  const latest = started.at(-1);
  const next = rounds.find((round) => !isNil(round.startAt) && round.startAt > now);
  const latestEnd = latest ? roundEndAt(latest) : null;
  const inProgress =
    latest && latestEnd && latestEnd > now && isNil(latest.endedAt) ? latest : null;

  const unscheduled = rounds.find((round) => isNil(round.startAt));
  const canSchedule =
    game.roundScheduleKind === "coordinated" && isNil(game.finishedAt) && isNil(game.cancelledAt);
  const scheduleAction =
    canSchedule && !next && unscheduled
      ? {
          label: `${unscheduled.roundNo}회차 일정 잡기`,
          href: `/games/${game.id}/rounds/${unscheduled.roundNo}/schedule`,
        }
      : undefined;

  const scheduleRow: ManageRow = {
    key: "rounds",
    icon: "calendar",
    label: nextRoundLabel({ next, finished: !isNil(game.finishedAt) }),
    detail: next ? `${next.roundNo}/${game.roundCount}회` : `총 ${game.roundCount}회`,
    href: `/games/${game.id}/rounds`,
    extraAction: scheduleAction,
    state: MANAGE_ROW_STATE.open,
  };

  const attendanceBase = { key: "attendance", icon: "clipboard" } as const;
  const attendanceRow: ManageRow = !latest
    ? {
        ...attendanceBase,
        label: "출석 확인",
        detail: "회차가 시작되면 열립니다",
        href: null,
        state: MANAGE_ROW_STATE.locked,
      }
    : {
        ...attendanceBase,
        label: `${latest.roundNo}회차 출석 확인`,
        detail: latest.attendanceConfirmedAt ? "출석을 정리했습니다" : "빠진 사람을 표시합니다",
        href: `/games/${game.id}/attendance?round=${latest.roundNo}`,
        state:
          latest.attendanceConfirmedAt || !isRoundOpen({ round: latest, now })
            ? MANAGE_ROW_STATE.done
            : MANAGE_ROW_STATE.open,
      };

  const endBase = { key: "end", icon: "flag", label: "세션 마치기", href: null } as const;
  const endRow: ManageRow =
    inProgress && inProgress.plannedEndAt
      ? {
          ...endBase,
          label: `${inProgress.roundNo}회차 마치기`,
          detail: "이 회차를 지금 마칩니다",
          state: MANAGE_ROW_STATE.open,
          action: MANAGE_ROW_ACTION.endSession,
          round: {
            roundNo: inProgress.roundNo,
            lastRound: inProgress.roundNo === game.roundCount,
            plannedEndAt: inProgress.plannedEndAt,
          },
        }
      : {
          ...endBase,
          detail: "회차가 진행 중일 때 마칠 수 있습니다",
          state: MANAGE_ROW_STATE.locked,
        };

  return [scheduleRow, attendanceRow, endRow];
}
