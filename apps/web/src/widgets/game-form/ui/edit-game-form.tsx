"use client";

import { isNull } from "es-toolkit";

import { countConfirmed } from "@/entities/game";
import { updateGame } from "@/features/write-game";
import type { GameDetailData } from "@/shared/server";

import { GameForm } from "./game-form";

interface EditGameFormProps {
  serverId: string;
  game: GameDetailData;
}

export function EditGameForm({ serverId, game }: EditGameFormProps) {
  return (
    <GameForm
      serverId={serverId}
      onSubmit={updateGame.bind(null, game.id)}
      defaultGame={game}
      submitLabel="수정 저장"
      successMessage="수정되었습니다"
      edit={{
        gameId: game.id,
        applicantCount: game.participants.length,
        confirmedCount: countConfirmed(game.participants),
        drawn: !isNull(game.drawnAt),
        minPlayers: game.minPlayers,
      }}
    />
  );
}
