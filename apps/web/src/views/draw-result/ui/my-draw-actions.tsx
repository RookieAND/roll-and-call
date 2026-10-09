import { Button, HStack, Text, VStack } from "@roll-and-call/ui";

import { LEAVE_KIND, LeaveConfirmButton } from "@/features/join-game";
import { ServerLink } from "@/shared/ui";

import { MY_DRAW_ACTION, type MyDrawAction } from "../model/my-draw-footer";

interface MyDrawActionsProps {
  gameId: string;
  hint: string | null;
  actions: MyDrawAction[];
  waitlistRank: number | null;
}

export function MyDrawActions({ gameId, hint, actions, waitlistRank }: MyDrawActionsProps) {
  const buttons = {
    [MY_DRAW_ACTION.leaveWaitlist]: (
      <LeaveConfirmButton
        key={MY_DRAW_ACTION.leaveWaitlist}
        gameId={gameId}
        kind={LEAVE_KIND.waitlist}
        waitlistRank={waitlistRank}
        size="lg"
      />
    ),
    [MY_DRAW_ACTION.viewGame]: (
      <Button
        key={MY_DRAW_ACTION.viewGame}
        render={<ServerLink path={`/games/${gameId}`} />}
        variant="outline"
        size="lg"
      >
        구인 글 보기
      </Button>
    ),
    [MY_DRAW_ACTION.submitAvailability]: (
      <Button
        key={MY_DRAW_ACTION.submitAvailability}
        render={<ServerLink path={`/games/${gameId}/schedule`} />}
        size="lg"
      >
        가능 시간 제출
      </Button>
    ),
  };

  return (
    <VStack gap="125">
      {hint && (
        <Text typography="body4" foreground="hint" className="text-center" render={<p />}>
          {hint}
        </Text>
      )}
      <HStack gap="100" className="[&>*]:min-w-0 *:flex-1">
        {actions.map((action) => buttons[action])}
      </HStack>
    </VStack>
  );
}
