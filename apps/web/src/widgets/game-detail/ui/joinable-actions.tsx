import { VStack } from "@roll-and-call/ui";

import { JoinGameButton } from "@/features/join-game";

import { JoinHint } from "./join-hint";

interface JoinableActionsProps {
  gameId: string;
  hint: string;
  label: string;
  applicationNote: boolean;
}

export function JoinableActions({ gameId, hint, label, applicationNote }: JoinableActionsProps) {
  return (
    <VStack gap="125">
      <JoinHint>{hint}</JoinHint>
      <JoinGameButton gameId={gameId} applicationNote={applicationNote} className="w-full">
        {label}
      </JoinGameButton>
    </VStack>
  );
}
