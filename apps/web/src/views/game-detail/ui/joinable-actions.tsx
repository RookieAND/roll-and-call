import { VStack } from "@roll-and-call/ui";

import { JoinGameButton } from "@/features/join-game";

import { JoinHint } from "./join-hint";

interface JoinableActionsProps {
  gameId: string;
  hint: string;
  label: string;
}

export function JoinableActions({ gameId, hint, label }: JoinableActionsProps) {
  return (
    <VStack gap="125">
      <JoinHint>{hint}</JoinHint>
      <JoinGameButton gameId={gameId} className="w-full">
        {label}
      </JoinGameButton>
    </VStack>
  );
}
