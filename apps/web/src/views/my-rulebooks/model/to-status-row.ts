import { CERT_STATE, RULEBOOK_KIND_GROUP, type MyRulebook } from "@/entities/rulebook";
import { toKst } from "@/shared/lib";

import { isFresh } from "./is-fresh";
import type { ListRow } from "./list-row";

export function toStatusRow({ rulebook, now }: { rulebook: MyRulebook; now: Date }): ListRow {
  const base = { key: rulebook.id, title: rulebook.label, href: `/me/rulebooks/${rulebook.id}` };
  if (rulebook.state === CERT_STATE.pending) {
    return {
      ...base,
      icon: "clock",
      tone: "gray",
      sub: `${RULEBOOK_KIND_GROUP[rulebook.kind]} · ${toKst(rulebook.stateAt!).format("MM.DD")} 신청`,
      badge: { label: "심사 중", palette: "gray" },
    };
  }
  return {
    ...base,
    icon: "alert",
    tone: "danger",
    sub: rulebook.rejection ?? "",
    subTone: "danger",
    badge: { label: "반려됨", palette: "danger" },
    fresh: isFresh(rulebook.stateAt, now),
  };
}
