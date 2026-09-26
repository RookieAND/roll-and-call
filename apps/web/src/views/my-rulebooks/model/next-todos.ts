import {
  CERT_OPTION,
  CERT_STATE,
  certApplyHref,
  certOption,
  isCertEnforced,
  RULEBOOK_KIND,
  SET_STATUS,
  setStatus,
  type MyRulebooks,
} from "@/entities/rulebook";
import { formatDate, subjectParticle } from "@/shared/lib";

import type { ListRow } from "./list-row";
import { recentUnopenedSets } from "./recent-unopened-sets";

const MAX_TODOS = 3;

// 다음 할 일은 반려된 신청 → 최근 연 룰의 미인증 판본 → 기본 룰북이 모자란 판본 순으로 세 줄까지.
export function nextTodos(data: MyRulebooks, now: Date): ListRow[] {
  const { rulebooks, sets, enforcementDate } = data;
  const rejected = rulebooks
    .filter(
      (rulebook) =>
        rulebook.state === CERT_STATE.rejected &&
        (rulebook.kind !== RULEBOOK_KIND.core ||
          sets.some((set) => set.cores.includes(rulebook) && !set.opened)),
    )
    .map((rulebook): ListRow => ({
      key: `rejected-${rulebook.id}`,
      icon: "alert",
      tone: "warning",
      title: `${rulebook.label} 인증이 반려됐습니다`,
      sub: "사유 보고 다시 신청하기",
      subTone: "primary",
      href: `/me/rulebooks/${rulebook.id}`,
    }));
  const deadline =
    enforcementDate && !isCertEnforced(enforcementDate, now)
      ? `${formatDate(enforcementDate)} 전에 인증하기`
      : "인증 신청하기";
  const pickable = (ids: typeof rulebooks) =>
    ids
      .filter((core) => certOption(core, rulebooks).type === CERT_OPTION.pick)
      .map((core) => core.id);
  const recent = recentUnopenedSets(data).map((set): ListRow => ({
    key: `recent-${set.key}`,
    icon: "clock",
    tone: "primary",
    title: `최근 연 ${set.label}${subjectParticle(set.label)} 아직 인증 전입니다`,
    sub: deadline,
    subTone: "primary",
    href: certApplyHref(pickable(setStatus(set).missing)),
  }));
  const partial = sets.flatMap((set): ListRow[] => {
    const { status, missing } = setStatus(set);
    if (status !== SET_STATUS.partial) return [];
    return [
      {
        key: `partial-${set.key}`,
        icon: "book",
        tone: "primary",
        title: `${set.label}, ${missing.length}권만 더 인증하면 GM`,
        sub: "남은 책 인증하기",
        subTone: "primary",
        href: certApplyHref(pickable(missing)),
      },
    ];
  });
  return [...rejected, ...recent, ...partial].slice(0, MAX_TODOS);
}
