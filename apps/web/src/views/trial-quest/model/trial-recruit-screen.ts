import { TRIAL_MINE_GAME_ID } from "./trial-kind";

export const TRIAL_RECRUIT_SCREEN = {
  wizard: "wizard",
  result: "result",
  list: "list",
  mine: "mine",
  manage: "manage",
} as const;
export type TrialRecruitScreenName =
  (typeof TRIAL_RECRUIT_SCREEN)[keyof typeof TRIAL_RECRUIT_SCREEN];

// 방금 등록한 체험 구인의 화면만 열린다. 다른 주소는 null이라 이동하지 않는다.
export function recruitScreenOfPath(path: string): TrialRecruitScreenName | null {
  if (path === "/games") return TRIAL_RECRUIT_SCREEN.list;
  if (path === `/games/${TRIAL_MINE_GAME_ID}`) return TRIAL_RECRUIT_SCREEN.mine;
  if (path === `/games/${TRIAL_MINE_GAME_ID}/manage`) return TRIAL_RECRUIT_SCREEN.manage;
  return null;
}
