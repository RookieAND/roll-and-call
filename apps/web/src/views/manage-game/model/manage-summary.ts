import { countConfirmed, isDeadlinePassed, isSessionEnded } from "@/entities/game";
import { formatDate, formatDateTime } from "@/shared/lib";
import type { GameDetailData } from "@/shared/server";

const STAGE = {
  coordinating: { label: "조율 중", color: "primary" },
  overdue: { label: "기한 지남", color: "warning" },
  confirmed: { label: "세션 확정", color: "success" },
  ended: { label: "끝남", color: "gray" },
} as const;

// 헤더는 운영 단계와 두 칸(시간 · 인원)만 읽는다. 시각이 정해지면 첫 칸이 세션 시간으로 바뀐다.
export function manageSummary(game: GameDetailData, responses: number, now = new Date()) {
  const confirmedCount = countConfirmed(game.participants);

  if (game.confirmedAt) {
    return {
      stage: isSessionEnded(game, now) ? STAGE.ended : STAGE.confirmed,
      time: { label: "세션 시간", value: formatDateTime(game.confirmedAt) },
    };
  }
  if (isDeadlinePassed(game.endDate, now)) {
    return {
      stage: STAGE.overdue,
      time: { label: "응답", value: `${responses} / ${confirmedCount}명` },
    };
  }
  return {
    stage: STAGE.coordinating,
    time: {
      label: "조율 기간",
      value:
        game.rangeStart && game.rangeEnd
          ? `${formatDate(game.rangeStart)} ~ ${formatDate(game.rangeEnd)}`
          : "일정 미정",
    },
  };
}
