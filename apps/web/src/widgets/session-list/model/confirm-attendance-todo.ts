import { clamp } from "es-toolkit";

import { ATTENDANCE_EDIT_HOURS, attendanceDeadline } from "@/entities/game";
import { ddayKst, formatDateTime } from "@/shared/lib";

import { SESSION_ACTION_KIND, type SessionGame, type SessionTodo } from "./session-card-model";

// 출석 할 일은 isAttendanceDue가 참일 때만 만든다. 그래서 세션 시각과 기한이 있다.
export function confirmAttendanceTodo({
  game,
  now,
}: {
  game: SessionGame;
  now: Date;
}): SessionTodo {
  const deadline = attendanceDeadline(game)!;
  const daysLeft = clamp(ddayKst(deadline, now), 0, ATTENDANCE_EDIT_HOURS / 24);
  return {
    kind: SESSION_ACTION_KIND.confirmAttendance,
    label: "출석 확인",
    href: `/games/${game.id}/attendance`,
    blocked: false,
    sortAt: deadline.toISOString(),
    eyebrow: `출석 확인 · 자동 처리 D-${daysLeft}`,
    lines: [
      `${formatDateTime(game.confirmedAt!)} 세션이 끝났습니다.`,
      "확인하지 않으면 출석이 자동으로 확정됩니다.",
    ],
  };
}
