import { isOpened } from "./is-opened";
import { setCores } from "./set-cores";
import type { MyRulebook } from "./to-my-rulebooks";

export function missingCores(rulebook: MyRulebook, rulebooks: MyRulebook[]) {
  return setCores(rulebook, rulebooks).filter((core) => !isOpened(core));
}
