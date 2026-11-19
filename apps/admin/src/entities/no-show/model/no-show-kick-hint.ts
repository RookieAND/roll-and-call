export function noShowKickHint(kickedRound: number | null): string | null {
  return kickedRound === null ? null : `${kickedRound}회차에 내보냄`;
}
