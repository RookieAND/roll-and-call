"use client";

import type { MyRulebooks } from "@/entities/rulebook";
import { createGame } from "@/features/write-game";
import { TRIAL_HANDLER, useTrialHandler } from "@/shared/trial";

import type { GameDefaults } from "../model/game-defaults";
import type { ReopenContext } from "../model/reopen-context";
import { GameForm } from "./game-form";

interface CreateGameFormProps {
  serverId: string;
  rulebooks: MyRulebooks;
  initialRulebookId?: string;
  defaultGame?: GameDefaults;
  reopen?: ReopenContext;
}

export function CreateGameForm({
  serverId,
  rulebooks,
  initialRulebookId,
  defaultGame,
  reopen,
}: CreateGameFormProps) {
  const create = useTrialHandler(TRIAL_HANDLER.createGame, createGame);
  return (
    <GameForm
      serverId={serverId}
      onSubmit={create}
      defaultGame={defaultGame}
      rulebooks={rulebooks}
      initialRulebookId={initialRulebookId}
      reopen={reopen}
      submitLabel="구인 등록"
      successMessage="구인이 등록되었습니다"
    />
  );
}
