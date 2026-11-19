import type { GameRoundRow } from "@roll-and-call/database/games";
import { roundEndAt } from "@roll-and-call/database/games/model";
import { isNil } from "es-toolkit";

import { roundRangeLabel, roundSlotLabel, roundTimeRange } from "@/entities/game";
import { formatDateWeekday } from "@/shared/lib";

import { roundRow, type RoundRowView } from "./round-row";
import { ROUND_ROW_KIND } from "./round-row-kind";

// 회차 일정 화면의 줄. 상태는 배지가 아니라 아이콘과 문장이다. 일정 없는 회차는 가장 앞 하나만 따로 보이고 나머지는 한 줄로 묶는다.
export function roundRowViews({
  rounds,
  now,
  canSchedule = false,
  canMove = false,
  coordinationResponse = null,
}: {
  rounds: readonly GameRoundRow[];
  now: Date;
  // 일정 없는 회차를 잡을 수 있다(조율형, 끝나지 않음).
  canSchedule?: boolean;
  // 시작 전 회차의 일정을 옮길 수 있다(끝나지 않음, 지정형·조율형 모두).
  canMove?: boolean;
  // 가능 시간을 모으는 회차의 응답 수. 그 회차 줄에만 붙는다.
  coordinationResponse?: { respondedCount: number; totalCount: number } | null;
}): RoundRowView[] {
  const views: RoundRowView[] = [];
  const waiting: number[] = [];
  for (const round of rounds) {
    const prefix = `${round.roundNo}회차 · `;
    if (round.status === "cancelling") {
      views.push(
        roundRow({
          roundNo: round.roundNo,
          kind: ROUND_ROW_KIND.cancelling,
          label: `${prefix}취소하는 중입니다`,
          title: "취소하는 중입니다",
        }),
      );
      continue;
    }
    if (isNil(round.startAt) || isNil(round.plannedEndAt)) {
      const hasOpenSlot = views.some(
        (view) =>
          view.kind === ROUND_ROW_KIND.unscheduled || view.kind === ROUND_ROW_KIND.coordinating,
      );
      if (round.status === "coordinating" && !hasOpenSlot) {
        views.push({
          ...roundRow({
            roundNo: round.roundNo,
            kind: ROUND_ROW_KIND.coordinating,
            label: `${prefix}가능 시간을 모으고 있습니다`,
            title: "가능 시간을 모으고 있습니다",
            subtitle: coordinationResponse
              ? `응답 ${coordinationResponse.respondedCount}/${coordinationResponse.totalCount}명`
              : null,
          }),
          note: coordinationResponse
            ? `응답 ${coordinationResponse.respondedCount}/${coordinationResponse.totalCount}명`
            : null,
          scheduleRoundNo: canSchedule ? round.roundNo : null,
        });
      } else if (!hasOpenSlot) {
        views.push({
          ...roundRow({
            roundNo: round.roundNo,
            kind: ROUND_ROW_KIND.unscheduled,
            label: `${prefix}아직 정하지 않았습니다`,
            title: "아직 정하지 않았습니다",
          }),
          scheduleRoundNo: canSchedule ? round.roundNo : null,
        });
      } else {
        waiting.push(round.roundNo);
      }
      continue;
    }
    const endAt = roundEndAt(round)!;
    if (round.startAt > now) {
      views.push({
        ...roundRow({
          roundNo: round.roundNo,
          kind: ROUND_ROW_KIND.scheduled,
          label: `${prefix}${roundSlotLabel({ startsAt: round.startAt, endsAt: round.plannedEndAt })}`,
          title: formatDateWeekday(round.startAt),
          subtitle: roundTimeRange({ startsAt: round.startAt, endsAt: round.plannedEndAt }),
        }),
        scheduleRoundNo: canMove ? round.roundNo : null,
      });
    } else if (endAt > now) {
      views.push({
        ...roundRow({
          roundNo: round.roundNo,
          kind: ROUND_ROW_KIND.inProgress,
          label: `${prefix}지금 진행 중입니다`,
          title: formatDateWeekday(round.startAt),
          subtitle: roundTimeRange({ startsAt: round.startAt, endsAt: round.plannedEndAt }),
        }),
        attendanceRoundNo: round.roundNo,
      });
    } else {
      const early = !isNil(round.endedAt) && round.endedAt < round.plannedEndAt;
      views.push({
        ...roundRow({
          roundNo: round.roundNo,
          kind: ROUND_ROW_KIND.finished,
          label: `${prefix}${roundSlotLabel({ startsAt: round.startAt, endsAt: endAt })}`,
          title: formatDateWeekday(round.startAt),
          subtitle: `${roundTimeRange({ startsAt: round.startAt, endsAt: endAt })}${early ? " · 일찍 마침" : ""}`,
        }),
        note: early ? "일찍 마침" : null,
        attendanceRoundNo: round.roundNo,
      });
    }
  }
  if (waiting.length > 0) {
    views.push({
      ...roundRow({
        roundNo: waiting[0]!,
        kind: ROUND_ROW_KIND.later,
        label: `${roundRangeLabel(waiting)} · 앞 회차를 잡은 뒤 정합니다`,
        title: `${roundRangeLabel(waiting)} · 앞 회차를 잡은 뒤 정합니다`,
      }),
      roundNo: null,
    });
  }
  return views;
}
