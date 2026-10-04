export type CoordinationWindow = { startHour: number; endHour: number };

// 기본 12:00~24:00. 끝 0은 다음 날 0시다.
export const DEFAULT_WINDOW = { startHour: 12, endHour: 0 } as const;

// 1~23시간. 시작과 끝이 같은 값은 DB 체크가 막는다.
export function windowHours({ startHour, endHour }: CoordinationWindow): number {
  return (endHour - startHour + 24) % 24;
}

export function crossesMidnight({ startHour, endHour }: CoordinationWindow): boolean {
  return endHour <= startHour;
}
