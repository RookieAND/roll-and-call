// 세션 시간 결정 폼이 읽는 게임 필드. 조율 기간이 정해진 게임만 폼까지 온다.
export interface ConfirmSessionGame {
  id: string;
  rangeStart: string;
  rangeEnd: string;
  windowStartHour: number;
  windowEndHour: number;
  // 플레이 시간을 비워 둔 게임도 기본값을 채운 분 단위(effectivePlayMinutes).
  playMinutes: number;
  maxPlayers: number;
  confirmedCount: number;
  confirmedAt: Date | null;
}
