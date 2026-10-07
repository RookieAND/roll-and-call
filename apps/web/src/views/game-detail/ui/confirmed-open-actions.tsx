import { VStack } from "@roll-and-call/ui";

import { LEAVE_KIND, LeaveConfirmButton } from "@/features/join-game";
import { formatDateTime } from "@/shared/lib";
import type { GameDetailData } from "@/shared/server";

import type { ActionLinks } from "../model/game-action-view";
import { ActionNotice } from "./action-notice";
import { ActionPair } from "./action-pair";
import { GameCalendarButton } from "./game-calendar-button";

interface ConfirmedOpenActionsProps extends ActionLinks {
  game: GameDetailData;
  confirmedAt: Date | null;
}

// 시각이 있으면 [캘린더에 추가]를 붙인다.
export function ConfirmedOpenActions({ game, confirmedAt, calendar }: ConfirmedOpenActionsProps) {
  const lines = confirmedAt ? [`${formatDateTime(confirmedAt)}에 진행합니다.`] : [];

  return (
    <VStack gap="125">
      <ActionNotice title="참여가 확정되었습니다" lines={lines} colorPalette="success" />
      <ActionPair>
        <LeaveConfirmButton gameId={game.id} kind={LEAVE_KIND.confirmed} size="lg" />
        {calendar && <GameCalendarButton game={game} variant="tinted" />}
      </ActionPair>
    </VStack>
  );
}
