import { CERT_STATE } from "./cert-state";
import type { EditionSet } from "./edition-sets";
import { isOpened } from "./is-opened";
import { RULEBOOK_KIND } from "./rulebook-kind";

export const SUPPLEMENT_OPTION_STATE = {
  open: "open",
  pending: "pending",
  locked: "locked",
} as const;

export type SupplementOptionState =
  (typeof SUPPLEMENT_OPTION_STATE)[keyof typeof SUPPLEMENT_OPTION_STATE];

export interface SupplementOption {
  id: string;
  name: string;
  state: SupplementOptionState;
}

const STATE_ORDER = Object.values(SUPPLEMENT_OPTION_STATE);

// 판본에 등록된 서플리먼트. 인증해 고를 수 있는 책을 위에, 심사 중·인증 필요 순으로 둔다.
// 인증 적용일 전(유예 기간, enforced가 false)에는 인증하지 않은 책도 모두 고를 수 있다.
export function supplementOptions(
  set: Pick<EditionSet, "extras">,
  { enforced }: { enforced: boolean },
): SupplementOption[] {
  return set.extras
    .filter((book) => book.kind === RULEBOOK_KIND.supplement)
    .map((book) => {
      if (!enforced || isOpened(book))
        return { id: book.id, name: book.name, state: SUPPLEMENT_OPTION_STATE.open };
      const state =
        book.state === CERT_STATE.pending
          ? SUPPLEMENT_OPTION_STATE.pending
          : SUPPLEMENT_OPTION_STATE.locked;
      return { id: book.id, name: book.name, state };
    })
    .toSorted(
      (left, right) =>
        STATE_ORDER.indexOf(left.state) - STATE_ORDER.indexOf(right.state) ||
        left.name.localeCompare(right.name, "ko"),
    );
}
