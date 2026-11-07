"use client";

import { VStack } from "@roll-and-call/ui";

import { ApproveCard } from "./approve-card";
import { ApproveHomebrewDialog } from "./approve-homebrew-dialog";
import { HomebrewRejectPanel } from "./homebrew-reject-panel";
import { RejectCard } from "./reject-card";
import { useHomebrewDecision } from "./use-homebrew-decision";

interface HomebrewDecisionPanelProps {
  applicationId: string;
  name: string;
  ruleLabel: string;
  // 심사 중인 신청인지. 처리된 신청은 두 버튼이 모두 비활성이다.
  decidable: boolean;
  nameConflict: boolean;
}

// 심사 화면 오른쪽 조치 열. 이름이 겹치면 승인만 막는다.
export function HomebrewDecisionPanel({
  applicationId,
  name,
  ruleLabel,
  decidable,
  nameConflict,
}: HomebrewDecisionPanelProps) {
  const decision = useHomebrewDecision({ applicationId, name });
  const rejecting = decidable && decision.rejecting;
  return (
    <VStack gap="150">
      <ApproveCard
        disabled={!decidable || nameConflict || rejecting}
        onApprove={decision.openApprove}
      />
      {rejecting ? (
        <HomebrewRejectPanel decision={decision} ruleLabel={ruleLabel} />
      ) : (
        <RejectCard disabled={!decidable} onReject={decision.startReject} />
      )}
      <ApproveHomebrewDialog decision={decision} name={name} />
    </VStack>
  );
}
