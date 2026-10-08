import type { ReactNode } from "react";

import { trialDetailKey } from "../model/trial-detail-key";
import type { TrialKind } from "../model/trial-kind";
import { TRIAL_SCREEN, type TrialScreen } from "../model/trial-screen";
import { TrialApplyResult } from "./trial-apply-result";
import { TrialJobList } from "./trial-job-list";

interface TrialApplyScreenProps {
  screen: TrialScreen;
  applied: Partial<Record<TrialKind, true>>;
  now: Date;
  details: Record<string, ReactNode>;
  onOpen: (screen: TrialScreen) => void;
}

export function TrialApplyScreen({ screen, applied, now, details, onOpen }: TrialApplyScreenProps) {
  if (screen.name === TRIAL_SCREEN.list) return <TrialJobList applied={applied} now={now} />;
  if (screen.name === TRIAL_SCREEN.result) {
    return (
      <TrialApplyResult
        kind={screen.kind}
        applied={applied}
        onBack={() => onOpen({ name: TRIAL_SCREEN.detail, kind: screen.kind })}
        onTryOther={(kind) => onOpen({ name: TRIAL_SCREEN.detail, kind })}
      />
    );
  }
  return details[trialDetailKey({ kind: screen.kind, applied: Boolean(applied[screen.kind]) })];
}
