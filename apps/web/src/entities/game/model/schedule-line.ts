import { ddayKst, formatDate, formatDateTime } from "@/shared/lib";
import type { Game } from "@/shared/server";

import { isDeadlinePassed } from "./is-deadline-passed";
import { SCHEDULE_MODE } from "./schedule-mode";
import { isSessionLocked } from "./session-lock";

const DEADLINE_WARN_DAYS = 3;

type ScheduleGame = Pick<
  Game,
  "scheduleMode" | "confirmedAt" | "rangeStart" | "rangeEnd" | "endDate"
>;

// D-n은 KST 날짜 차이로 센다(날짜 경계에서 서버·클라이언트 값이 갈리지 않게).
export function scheduleLine(game: ScheduleGame, now: Date = new Date()) {
  const confirmed =
    game.scheduleMode === SCHEDULE_MODE.coordinate &&
    isSessionLocked({
      scheduleMode: game.scheduleMode,
      confirmedAt: game.confirmedAt,
      now: now.getTime(),
    });

  let text: string;
  if (game.confirmedAt) {
    text = confirmed
      ? `${formatDateTime(game.confirmedAt)} 확정`
      : formatDateTime(game.confirmedAt);
  } else if (game.rangeStart && game.rangeEnd) {
    text = `${formatDate(game.rangeStart)} ~ ${formatDate(game.rangeEnd)} 중 조율`;
  } else {
    text = "일정 미정";
  }

  const deadlinePassed = isDeadlinePassed(game.endDate, now);
  const days = ddayKst(game.endDate, now);

  return {
    text,
    confirmed,
    undecided: !game.confirmedAt && !(game.rangeStart && game.rangeEnd),
    // 일시 지정형은 등록 때부터 날짜가 정해져 있어 확정과 같은 색으로 보인다.
    dated: Boolean(game.confirmedAt),
    finished: false,
    deadlinePassed,
    deadline: deadlinePassed ? null : days === 0 ? "오늘 마감" : `마감 D-${days}`,
    deadlineShort: deadlinePassed ? null : days === 0 ? "오늘" : `D-${days}`,
    deadlineWarn: !deadlinePassed && days <= DEADLINE_WARN_DAYS,
  };
}

export type ScheduleLine = ReturnType<typeof scheduleLine>;
