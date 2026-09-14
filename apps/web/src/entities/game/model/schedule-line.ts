import { ddayKst, formatDate, formatDateTime } from "@/shared/lib";
import type { Game } from "@/shared/server";
import { isDeadlinePassed } from "./deadline";
import { SCHEDULE_MODE } from "./schedule-mode";
import { isSessionLocked } from "./session-lock";

// 마감 D-n이 이 안쪽이면 warning 색.
const DEADLINE_WARN_DAYS = 3;

type ScheduleGame = Pick<Game, "scheduleMode" | "confirmedAt" | "rangeStart" | "rangeEnd" | "endDate">;

// 일정 상태 한 줄(배지가 아니라 글) + 모집 마감 D-n. 목록 카드와 상세가 같은 문구를 쓴다.
// D-n은 KST 날짜 차이로 서버에서 센다(날짜 경계에서 서버·클라이언트 값이 갈리지 않게).
export function scheduleLine(game: ScheduleGame, now: Date = new Date()) {
  const confirmed =
    game.scheduleMode === SCHEDULE_MODE.coordinate &&
    isSessionLocked({ scheduleMode: game.scheduleMode, confirmedAt: game.confirmedAt, now: now.getTime() });

  let text: string;
  if (game.confirmedAt) {
    // 조율형은 GM이 확정한 시각, 일시 지정형은 등록할 때 정한 시각.
    text = confirmed ? `${formatDateTime(game.confirmedAt)} 확정` : formatDateTime(game.confirmedAt);
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
    deadlinePassed,
    // 긴 표기(상세 "마감 D-3")와 짧은 표기(목록 카드 "D-3"). 기한이 지났으면 null.
    deadline: deadlinePassed ? null : days === 0 ? "오늘 마감" : `마감 D-${days}`,
    deadlineShort: deadlinePassed ? null : days === 0 ? "오늘" : `D-${days}`,
    deadlineWarn: !deadlinePassed && days <= DEADLINE_WARN_DAYS,
  };
}

export type ScheduleLine = ReturnType<typeof scheduleLine>;
