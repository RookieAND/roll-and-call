export const PROMOTE_MODE = {
  promote: "promote",
  raise: "raise",
  blocked: "blocked",
} as const;

export type PromoteMode = (typeof PROMOTE_MODE)[keyof typeof PROMOTE_MODE];

// [참여자로 등록]의 상태와 설명 두 줄. 세션 시작 뒤 정원이 찼으면 한 번만 정원을 늘려 넣는다.
export function promoteOption({
  isFull,
  started,
  capacityRaised,
  maxPlayers,
}: {
  isFull: boolean;
  started: boolean;
  capacityRaised: boolean;
  maxPlayers: number;
}): { mode: PromoteMode; lines: string[] } {
  if (!isFull) return { mode: PROMOTE_MODE.promote, lines: ["해당 인원을 참여자로 지정합니다."] };
  if (!started) {
    return {
      mode: PROMOTE_MODE.blocked,
      lines: [`정원 ${maxPlayers}명이 차 있습니다.`, "확정에서 한 명을 대기로 옮겨 주세요."],
    };
  }
  if (capacityRaised) {
    return {
      mode: PROMOTE_MODE.blocked,
      lines: ["이미 정원을 한 번 늘렸습니다.", "불참으로 내보내면 자리가 납니다."],
    };
  }
  return {
    mode: PROMOTE_MODE.raise,
    lines: [`정원 ${maxPlayers}명이 차 있습니다.`, "등록하면 정원을 1명 늘립니다."],
  };
}
