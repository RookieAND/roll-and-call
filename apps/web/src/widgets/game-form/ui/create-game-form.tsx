"use client";

import type { MyRulebooks } from "@/entities/rulebook";
import { createGame } from "@/features/write-game";

import { GameForm } from "./game-form";

interface CreateGameFormProps {
  rulebooks: MyRulebooks;
  initialRulebookId?: string;
}

export function CreateGameForm({ rulebooks, initialRulebookId }: CreateGameFormProps) {
  return (
    <GameForm
      onSubmit={createGame}
      rulebooks={rulebooks}
      initialRulebookId={initialRulebookId}
      submitLabel="구인 등록"
      successMessage="구인이 등록되었습니다"
    />
  );
}
