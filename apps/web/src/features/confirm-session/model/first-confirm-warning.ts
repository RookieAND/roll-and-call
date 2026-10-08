export function firstConfirmWarning({
  confirmedCount,
  maxPlayers,
}: {
  confirmedCount: number;
  maxPlayers: number;
}): string[] | null {
  if (confirmedCount === 0) {
    return ["확정된 참여자가 없습니다.", "이대로 확정하면 출석 확인 없이 끝납니다."];
  }
  if (confirmedCount < maxPlayers) {
    return [`정원 ${maxPlayers}명 중 ${confirmedCount}명으로 확정하면 모집이 닫힙니다.`];
  }
  return null;
}
