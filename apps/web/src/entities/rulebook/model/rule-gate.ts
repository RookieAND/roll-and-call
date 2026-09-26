import { formatDate, topicParticle } from "@/shared/lib";

import { certApplyHref } from "./cert-apply-href";
import { CERT_OPTION, certOption } from "./cert-option";
import type { EditionSet } from "./edition-sets";
import { isCertEnforced } from "./is-cert-enforced";
import { SET_STATUS, setStatus } from "./set-status";
import type { MyRulebooks } from "./to-my-rulebooks";

export const RULE_GATE = { open: "open", notice: "notice", blocked: "blocked" } as const;
export type RuleGateType = (typeof RULE_GATE)[keyof typeof RULE_GATE];

export interface RuleGate {
  type: RuleGateType;
  // 열 수 있을 때 붙는 한 줄(신판 인증으로 열림).
  okText: string | null;
  lines: string[];
  action: { label: string; href: string } | null;
}

// 구인을 이 판본으로 열 수 있는지. 적용일 전에는 알려만 주고, 지나면 막는다.
export function ruleGate(
  set: EditionSet,
  { rulebooks, sets, enforcementDate }: MyRulebooks,
  now: Date = new Date(),
): RuleGate {
  const { status, book, missing } = setStatus(set);
  const applicable = missing
    .filter((core) => certOption(core, rulebooks).type === CERT_OPTION.pick)
    .map((core) => core.id);
  const applyAction = (label: string) => ({ label, href: certApplyHref(applicable) });
  if (set.opened) {
    return {
      type: RULE_GATE.open,
      okText: set.unlockedBy ? `${set.unlockedBy} 인증으로 열 수 있습니다` : null,
      lines: [],
      action: null,
    };
  }
  if (!isCertEnforced(enforcementDate, now)) {
    return enforcementDate
      ? {
          type: RULE_GATE.notice,
          okText: null,
          lines: [
            `${formatDate(enforcementDate)}부터는 이 룰로 구인을 열려면 룰북 인증이 필요합니다.`,
          ],
          action: status === SET_STATUS.pending ? null : applyAction("지금 인증 신청하기"),
        }
      : { type: RULE_GATE.open, okText: null, lines: [], action: null };
  }
  const blocked = (lines: string[], action: RuleGate["action"]): RuleGate => ({
    type: RULE_GATE.blocked,
    okText: null,
    lines,
    action,
  });
  switch (status) {
    case SET_STATUS.partial:
      return blocked(
        [
          `기본 룰북 ${set.cores.length}권 중 ${missing.length}권이 남았습니다.`,
          "남은 책을 인증하면 열 수 있습니다.",
        ],
        applyAction("남은 책 인증하기"),
      );
    case SET_STATUS.pending:
      return blocked(["인증 심사 중입니다.", "승인되면 바로 열 수 있습니다."], {
        label: "내 룰북 보기",
        href: "/me/rulebooks",
      });
    case SET_STATUS.rejected:
    case SET_STATUS.revoked:
      return blocked(["인증이 완료되지 않았습니다.", "다시 신청해 주세요."], {
        label: "다시 신청하기",
        href: `/me/rulebooks/${book!.id}`,
      });
    default: {
      const otherEdition = sets.some(
        (other) => other !== set && other.categoryId === set.categoryId && other.earned,
      );
      const edition = set.edition || set.categoryName;
      return blocked(
        [
          ...(otherEdition ? [`${edition}${topicParticle(edition)} 따로 인증이 필요합니다.`] : []),
          "이 룰로 구인을 열려면 룰북 인증이 필요합니다.",
        ],
        applyAction("인증 신청하기"),
      );
    }
  }
}
