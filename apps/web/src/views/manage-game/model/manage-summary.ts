import { isDeadlinePassed, isSessionEnded, splitRoster } from "@/entities/game";
import { formatDate, formatDateTime } from "@/shared/lib";
import type { GameDetailData } from "@/shared/server";

export type ManageStat = { label: string; value: string; danger?: boolean };

// 숫자는 헤더에서만 읽는다. 시각이 정해지면 첫 칸이 세션 일시로 바뀌고, 셋째 칸은 대기·출석으로 바뀐다.
export function manageSummary(game: GameDetailData, responses: number, now = new Date()) {
  const { confirmed, waiting } = splitRoster(game.participants);
  const seats: ManageStat = {
    label: "확정 인원",
    value: `${confirmed.length} / ${game.maxPlayers}명`,
  };

  if (game.confirmedAt) {
    const ended = isSessionEnded(game, now);
    const attended = game.attendanceConfirmedAt
      ? confirmed.filter((participant) => !participant.absent).length
      : 0;
    return {
      stage: ended ? "끝남" : "세션 확정",
      stats: [
        { label: "세션 일시", value: formatDateTime(game.confirmedAt) },
        seats,
        ended
          ? { label: "출석", value: `${attended} / ${confirmed.length}명` }
          : { label: "대기", value: `${waiting.length}명` },
      ],
    };
  }

  const overdue = isDeadlinePassed(game.endDate, now);
  return {
    stage: overdue ? "기한 지남" : "조율 중",
    stats: [
      {
        label: "조율 마감",
        value: `${formatDate(game.endDate)}${overdue ? " 지남" : ""}`,
        danger: overdue,
      },
      { label: "가능 시간 제출", value: `${responses} / ${confirmed.length}명` },
      seats,
    ],
  };
}
