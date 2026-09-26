"use client";

import type { MyRulebooks } from "@/entities/rulebook";
import { createGame, type PreConfirmedPlayer } from "@/features/write-game";

import type { GameDefaults } from "../model/game-defaults";
import { GameForm } from "./game-form";

interface CreateGameFormProps {
  rulebooks: MyRulebooks;
  initialRulebookId?: string;
  defaultGame?: GameDefaults;
  defaultPreConfirmed?: PreConfirmedPlayer[];
}

export function CreateGameForm({
  rulebooks,
  initialRulebookId,
  defaultGame,
  defaultPreConfirmed,
}: CreateGameFormProps) {
  return (
    <GameForm
      onSubmit={createGame}
      rulebooks={rulebooks}
      initialRulebookId={initialRulebookId}
      defaultGame={defaultGame}
      defaultPreConfirmed={defaultPreConfirmed}
      submitLabel="구인 등록"
      successMessage="구인이 등록되었습니다"
    />
  );
}
