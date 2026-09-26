import {
  CERT_STATE,
  rejectionSummary,
  RULEBOOK_KIND_GROUP,
  type MyRulebook,
} from "@/entities/rulebook";
import { toKst } from "@/shared/lib";

import { isFresh } from "./is-fresh";
import type { ListRow } from "./list-row";

// 인증 현황의 한 줄. 반려·인증 취소·심사 중인 책만 온다.
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
  const rejected = rulebook.state === CERT_STATE.rejected;
  return {
    ...base,
    icon: "alert",
    tone: "danger",
    sub: rejected
      ? rejectionSummary(rulebook.latestApplication)
      : (rulebook.revokeReason ?? "운영진이 인증을 취소했습니다"),
    subTone: "danger",
    badge: { label: rejected ? "반려됨" : "취소됨", palette: "danger" },
    fresh: isFresh(rulebook.stateAt, now),
  };
}
