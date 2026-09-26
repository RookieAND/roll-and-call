import { toKst } from "@/shared/lib";

import { certRowMeta } from "./cert-row-meta";
import { CERT_STATE } from "./cert-state";
import { missingCores } from "./missing-cores";
import { RULEBOOK_KIND } from "./rulebook-kind";
import type { MyRulebook } from "./to-my-rulebooks";

export const CERT_OPTION = {
  free: "free",
  certified: "certified",
  unlocked: "unlocked",
  pending: "pending",
  // 서플리먼트인데 같은 판본 기본 룰북을 아직 다 인증하지 않았다(심사 중 포함).
  needsCore: "needsCore",
  pick: "pick",
} as const;

export type CertOptionType = (typeof CERT_OPTION)[keyof typeof CERT_OPTION];

const PICK_AGAIN = "다시 신청할 수 있습니다";

// 인증 신청에서 책 한 권을 고를 수 있는지와 그 이유 한 줄.
export function certOption(
  rulebook: MyRulebook,
  rulebooks: MyRulebook[],
): { type: CertOptionType; note: string; missing: MyRulebook[] } {
  const result = (type: CertOptionType, note: string, missing: MyRulebook[] = []) => ({
    type,
    note,
    missing,
  });
  if (!rulebook.certRequired)
    return result(CERT_OPTION.free, "무료 배포라 인증 없이 열 수 있습니다");
  if (rulebook.state === CERT_STATE.certified) {
    return result(CERT_OPTION.certified, certRowMeta(rulebook));
  }
  if (rulebook.unlockedBy) {
    const newer = rulebook.unlockedBy.edition || rulebook.unlockedBy.shortName;
    return result(CERT_OPTION.unlocked, `${newer} 인증으로 함께 열립니다`);
  }
  if (rulebook.state === CERT_STATE.pending)
    return result(CERT_OPTION.pending, certRowMeta(rulebook));

  if (rulebook.kind === RULEBOOK_KIND.supplement) {
    const missing = missingCores(rulebook, rulebooks);
    if (missing.length > 0) {
      return result(CERT_OPTION.needsCore, "같은 판본의 기본 룰북을 먼저 인증해야 합니다", missing);
    }
  }

  if (rulebook.state === CERT_STATE.rejected && rulebook.stateAt) {
    return result(
      CERT_OPTION.pick,
      `${toKst(rulebook.stateAt).format("MM.DD")} 반려 · ${PICK_AGAIN}`,
    );
  }
  if (rulebook.state === CERT_STATE.revoked && rulebook.stateAt) {
    return result(
      CERT_OPTION.pick,
      `${toKst(rulebook.stateAt).format("MM.DD")} 인증 취소 · ${PICK_AGAIN}`,
    );
  }
  if (rulebook.kind === RULEBOOK_KIND.handbook) {
    return result(CERT_OPTION.pick, "GM 자격에는 포함되지 않습니다");
  }
  return result(CERT_OPTION.pick, "");
}
