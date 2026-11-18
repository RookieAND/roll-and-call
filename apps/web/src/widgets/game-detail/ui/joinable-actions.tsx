import { VStack } from "@roll-and-call/ui";

import { JoinGameButton, type MultiRoundApply } from "@/features/join-game";

import { JoinHint } from "./join-hint";

interface JoinableActionsProps {
  gameId: string;
  hint: string;
  label: string;
  applicationQuestion: string | null;
  multiRound?: MultiRoundApply;
}

export function JoinableActions({
  gameId,
  hint,
  label,
  applicationQuestion,
  multiRound,
}: JoinableActionsProps) {
  return (
    <VStack gap="125">
      <JoinHint>{hint}</JoinHint>
      <JoinGameButton
        gameId={gameId}
        applicationQuestion={applicationQuestion}
        multiRound={multiRound}
        className="w-full"
      >
        {label}
      </JoinGameButton>
    </VStack>
  );
}
