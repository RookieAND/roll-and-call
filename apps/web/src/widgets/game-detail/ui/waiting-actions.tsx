import { VStack } from "@roll-and-call/ui";

import { LEAVE_KIND, LeaveConfirmButton } from "@/features/join-game";

import { ActionNotice } from "./action-notice";
import { ActionPair } from "./action-pair";
import { DrawResultLink } from "./draw-result-link";

interface WaitingActionsProps {
  gameId: string;
  rank: number;
  resultLink: boolean;
  selection: boolean;
}

// 대기자는 자동으로 확정되지 않는다(D2). GM이 대기 명단에서 확정한다.
export function WaitingActions({ gameId, rank, resultLink, selection }: WaitingActionsProps) {
  const waitingLines = selection
    ? ["자리가 나면 GM이 대기 명단에서 확정합니다."]
    : ["자리가 나면 GM이 대기 명단에서 확정합니다.", "빈자리가 생기면 알림 탭으로 알립니다."];
  return (
    <VStack gap="125">
      <ActionNotice title={`현재 대기 ${rank}번입니다`} lines={waitingLines} />
      <ActionPair>
        <LeaveConfirmButton
          gameId={gameId}
          kind={LEAVE_KIND.waitlist}
          waitlistRank={rank}
          size="lg"
        />
        {resultLink && <DrawResultLink gameId={gameId} variant="tinted" size="lg" />}
      </ActionPair>
    </VStack>
  );
}
