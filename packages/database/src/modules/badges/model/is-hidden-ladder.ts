import { HIDDEN_LADDER, type BadgeLadderKey, type HiddenLadderKey } from "./badge-ladder";

const HIDDEN_KEYS: ReadonlySet<string> = new Set(Object.values(HIDDEN_LADDER));

export function isHiddenLadder(ladder: BadgeLadderKey): ladder is HiddenLadderKey {
  return HIDDEN_KEYS.has(ladder);
}
