import { CERT_STATE } from "./cert-state";
import type { MyRulebook } from "./to-my-rulebooks";

// 인증 없이 열리거나, 인증했거나, 신판 인증으로 함께 열린 책.
export function isOpened(rulebook: MyRulebook) {
  return (
    !rulebook.certRequired ||
    rulebook.state === CERT_STATE.certified ||
    rulebook.unlockedBy !== null
  );
}
