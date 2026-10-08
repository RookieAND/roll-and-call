import type { ReactNode } from "react";

import { TRIAL_CERT_SCREEN, type TrialCertScreenName } from "../model/trial-cert-screen";
import type { TrialCert } from "../model/trial-store";
import { TrialCertDetail } from "./trial-cert-detail";
import { TrialCertResult } from "./trial-cert-result";
import { TrialMyRulebooks } from "./trial-my-rulebooks";

interface TrialRulebookCertScreenProps {
  screen: TrialCertScreenName;
  form: ReactNode;
  cert: TrialCert | null;
  onOpen: (screen: TrialCertScreenName) => void;
  onApprove: () => void;
}

export function TrialRulebookCertScreen({
  screen,
  form,
  cert,
  onOpen,
  onApprove,
}: TrialRulebookCertScreenProps) {
  if (!cert || screen === TRIAL_CERT_SCREEN.apply) return form;
  if (screen === TRIAL_CERT_SCREEN.result) {
    return (
      <TrialCertResult
        onBack={() => onOpen(TRIAL_CERT_SCREEN.apply)}
        onOpenMine={() => onOpen(TRIAL_CERT_SCREEN.mine)}
      />
    );
  }
  if (screen === TRIAL_CERT_SCREEN.mine) {
    return (
      <TrialMyRulebooks
        cert={cert}
        onBack={() => onOpen(TRIAL_CERT_SCREEN.result)}
        onOpenDetail={() => onOpen(TRIAL_CERT_SCREEN.detail)}
        onApprove={onApprove}
      />
    );
  }
  return <TrialCertDetail cert={cert} onBack={() => onOpen(TRIAL_CERT_SCREEN.mine)} />;
}
