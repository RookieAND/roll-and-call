export const PLAY_STANCE = {
  gm: "gm",
  player: "player",
} as const;

export type PlayStance = (typeof PLAY_STANCE)[keyof typeof PLAY_STANCE];

const MIN_FINISHED_SESSIONS = 5;
const LEAN_PERCENT = 70;

// 등급이 아니라 어느 자리에 많이 앉았는지다. 표본이 적거나 한쪽으로 기울지 않았으면 라벨을 붙이지 않는다.
export function derivePlayStance({
  hosted,
  played,
}: {
  hosted: number;
  played: number;
}): PlayStance | null {
  const total = hosted + played;
  if (total < MIN_FINISHED_SESSIONS) return null;
  if (hosted * 100 >= total * LEAN_PERCENT) return PLAY_STANCE.gm;
  if (played * 100 >= total * LEAN_PERCENT) return PLAY_STANCE.player;
  return null;
}
