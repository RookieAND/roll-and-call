import { DEFAULT_WINDOW, type CoordinationWindow } from "./coordination-window";

// 앞서 시간대를 정한 회차가 있으면 가장 늦은 회차의 값을, 없으면 구인 등록 때 정한 시간대를 쓴다.
export function defaultCoordinationWindow({
  rounds,
  game,
}: {
  rounds: readonly {
    roundNo: number;
    coordinationWindowStartHour: number | null;
    coordinationWindowEndHour: number | null;
  }[];
  game: { windowStartHour: number | null; windowEndHour: number | null };
}): CoordinationWindow {
  const previous = rounds
    .filter(
      (round) =>
        round.coordinationWindowStartHour !== null && round.coordinationWindowEndHour !== null,
    )
    .toSorted((a, b) => b.roundNo - a.roundNo)[0];
  if (previous) {
    return {
      startHour: previous.coordinationWindowStartHour!,
      endHour: previous.coordinationWindowEndHour!,
    };
  }
  if (game.windowStartHour !== null && game.windowEndHour !== null) {
    return { startHour: game.windowStartHour, endHour: game.windowEndHour };
  }
  return DEFAULT_WINDOW;
}
