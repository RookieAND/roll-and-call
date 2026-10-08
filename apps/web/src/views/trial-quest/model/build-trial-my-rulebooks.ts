import { CERT_STATE, editionSets, type MyRulebooks } from "@/entities/rulebook";

import { TRIAL_RULEBOOK } from "./trial-rulebook";

// 룰북 인증 퀘스트를 깬 사람에게는 체험용 룰북이 인증된 것으로 열린다(R21).
export function buildTrialMyRulebooks(now: Date): MyRulebooks {
  const rulebooks = [{ ...TRIAL_RULEBOOK, state: CERT_STATE.certified, stateAt: now }];
  return {
    rulebooks,
    sets: editionSets(rulebooks),
    requests: [],
    enforcementDate: null,
    recentRulebookIds: [],
    pendingRequestNames: [],
    sanction: null,
  };
}
