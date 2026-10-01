import { isNull } from "es-toolkit";

import { CERT_STATE } from "./cert-state";
import type { MyRulebook } from "./to-my-rulebooks";

export function isOpened(rulebook: MyRulebook) {
  return (
    !rulebook.certRequired ||
    rulebook.state === CERT_STATE.certified ||
    !isNull(rulebook.unlockedBy)
  );
}
