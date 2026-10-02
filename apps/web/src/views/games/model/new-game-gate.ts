import { CERT_STATE, type MyRulebooks } from "@/entities/rulebook";

// 인증해서 연 판본이 하나도 없을 때만 안내 시트를 띄운다. 심사 중인 신청이 있으면 그것을 보여 준다.
export function newGameGate({ rulebooks, sets }: MyRulebooks) {
  if (sets.some((set) => set.earned)) return null;
  const pending = rulebooks.find((rulebook) => rulebook.state === CERT_STATE.pending);
  return {
    pending: pending
      ? { rulebookId: pending.id, label: pending.label, appliedAt: pending.stateAt! }
      : null,
  };
}
