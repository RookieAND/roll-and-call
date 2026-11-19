import { isNull } from "es-toolkit";

// 서버를 떠난 GM의 구인을 어떻게 정리할지. 시작 전이면 취소, 시작했고 출석 확인 전이면 전원 출석, 나머지는 기록으로 둔다.
// 다회차(roundCount > 1)는 시작한 뒤 끝나기 전이면 회차 출석과 상관없이 조기 종결한다.
export function departedGmGameAction({
  game,
  now,
}: {
  game: {
    confirmedAt: Date | null;
    attendanceConfirmedAt: Date | null;
    cancelledAt: Date | null;
    roundCount?: number;
    finishedAt?: Date | null;
  };
  now: Date;
}): "cancel" | "confirm_attendance" | "finish_early" | "keep" {
  if (!isNull(game.cancelledAt)) return "keep";
  if (isNull(game.confirmedAt) || game.confirmedAt.getTime() > now.getTime()) return "cancel";
  if ((game.roundCount ?? 1) > 1) return isNull(game.finishedAt ?? null) ? "finish_early" : "keep";
  return isNull(game.attendanceConfirmedAt) ? "confirm_attendance" : "keep";
}
