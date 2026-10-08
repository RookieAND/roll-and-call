import { CertApplyForm } from "@/features/certify-rulebook";

import { TRIAL_NICKNAME, TRIAL_RULEBOOK, TRIAL_SELLERS } from "../model/trial-rulebook";
import { TrialBanner } from "./trial-banner";
import { TrialRulebookCert } from "./trial-rulebook-cert";

// 인증 신청 폼은 실제 컴포넌트를 서버에서 그려 슬롯으로 넘긴다. 사진은 샘플만 들어가고 제출은 체험 핸들러가 가로챈다.
export function TrialRulebookCertView() {
  return (
    <TrialRulebookCert
      form={
        <CertApplyForm
          serverId="trial-server"
          rulebook={TRIAL_RULEBOOK}
          nickname={TRIAL_NICKNAME}
          sellers={TRIAL_SELLERS}
          quiz={null}
          rejection={null}
          previews={{}}
          belowAppBar={<TrialBanner />}
        />
      }
    />
  );
}
