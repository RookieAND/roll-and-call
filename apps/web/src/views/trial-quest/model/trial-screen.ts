import { trialKindOf, type TrialKind } from "./trial-kind";

export const TRIAL_SCREEN = { list: "list", detail: "detail", result: "result" } as const;

export type TrialScreen =
  | { name: typeof TRIAL_SCREEN.list }
  | { name: typeof TRIAL_SCREEN.detail; kind: TrialKind }
  | { name: typeof TRIAL_SCREEN.result; kind: TrialKind };

const GAME_PATH = /^\/games\/([^/]+)$/;

// 실제 화면 컴포넌트의 링크 주소(/games, /games/{id})를 체험 화면으로 옮긴다. 모르는 주소는 null이라 이동하지 않는다.
export function screenOfPath(path: string): TrialScreen | null {
  if (path === "/games") return { name: TRIAL_SCREEN.list };
  const match = GAME_PATH.exec(path);
  const gameId = match?.[1];
  const kind = gameId ? trialKindOf(gameId) : null;
  return kind ? { name: TRIAL_SCREEN.detail, kind } : null;
}
