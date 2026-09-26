import { CERT_STATE, CERT_STATE_META, certRowMeta, type MyRulebook } from "@/entities/rulebook";

import { isFresh } from "./is-fresh";
import type { ListRow, RowIcon, RowTone } from "./list-row";

const STATE_ICON: Partial<Record<string, RowIcon>> = {
  [CERT_STATE.certified]: "check",
  [CERT_STATE.rejected]: "alert",
  [CERT_STATE.revoked]: "alert",
};

const STATE_TONE: Partial<Record<string, RowTone>> = {
  [CERT_STATE.certified]: "success",
  [CERT_STATE.rejected]: "warning",
  [CERT_STATE.revoked]: "danger",
};

// 서플리먼트·플레이어 책 한 줄. GM 자격과 따로 보여 준다.
export function toExtraRow(rulebook: MyRulebook, now: Date): ListRow {
  const state = rulebook.state!;
  const tone = STATE_TONE[state] ?? "gray";
  const rejected = state === CERT_STATE.rejected;
  return {
    key: rulebook.id,
    icon: STATE_ICON[state] ?? "clock",
    tone,
    title: rulebook.label,
    sub: certRowMeta(rulebook),
    subTone: rejected ? "warning" : "muted",
    badge: { label: CERT_STATE_META[state].label, palette: tone },
    fresh: rejected && isFresh(rulebook.stateAt, now),
    href: `/me/rulebooks/${rulebook.id}`,
  };
}
