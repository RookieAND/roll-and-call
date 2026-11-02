import { VStack } from "@roll-and-call/ui";

import { JoinGameButton } from "@/features/join-game";

import { JoinHint } from "./join-hint";

interface JoinableActionsProps {
  gameId: string;
  hint: string;
  label: string;
  applicationQuestion: string | null;
}

export function JoinableActions({
  gameId,
  hint,
  label,
  applicationQuestion,
}: JoinableActionsProps) {
  return (
    <VStack gap="125">
      <JoinHint>{hint}</JoinHint>
      <JoinGameButton gameId={gameId} applicationQuestion={applicationQuestion} className="w-full">
        {label}
      </JoinGameButton>
    </VStack>
  );
}
