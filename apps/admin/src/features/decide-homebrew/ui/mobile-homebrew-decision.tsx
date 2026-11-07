"use client";

import { Button, HStack, VStack } from "@roll-and-call/ui";

import { MobileActionBar } from "@/shared/ui";

import { ApproveHomebrewDialog } from "./approve-homebrew-dialog";
import { HomebrewRejectPanel } from "./homebrew-reject-panel";
import { useHomebrewDecision } from "./use-homebrew-decision";

interface MobileHomebrewDecisionProps {
  applicationId: string;
  name: string;
  ruleLabel: string;
  decidable: boolean;
  nameConflict: boolean;
}

// 모바일은 아래 고정 바에 [반려] [승인]을 두고, 반려 패널은 본문 끝에 연다.
export function MobileHomebrewDecision({
  applicationId,
  name,
  ruleLabel,
  decidable,
  nameConflict,
}: MobileHomebrewDecisionProps) {
  const decision = useHomebrewDecision({ applicationId, name });
  const rejecting = decidable && decision.rejecting;
  return (
    <>
      {rejecting ? (
        <VStack className="px-150 pb-200">
          <HomebrewRejectPanel decision={decision} ruleLabel={ruleLabel} />
        </VStack>
      ) : (
        <MobileActionBar elevated={false}>
          <HStack gap="100">
            <Button
              variant="outline"
              colorPalette="danger"
              disabled={!decidable}
              onClick={decision.startReject}
              className="min-h-12 flex-1"
            >
              반려
            </Button>
            <Button
              colorPalette="success"
              disabled={!decidable || nameConflict}
              onClick={decision.openApprove}
              className="min-h-12 flex-[1.4]"
            >
              승인
            </Button>
          </HStack>
        </MobileActionBar>
      )}
      <ApproveHomebrewDialog decision={decision} name={name} />
    </>
  );
}
