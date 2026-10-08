import { GAME_KIND, type GameKind } from "./game-kind";

export function gameKindLabel(kind: GameKind) {
  return kind === GAME_KIND.briefing ? "설명회" : "세션";
}
