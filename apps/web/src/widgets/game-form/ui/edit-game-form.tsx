"use client";

import { countConfirmed } from "@/entities/game";
import { updateGame } from "@/features/write-game";
import type { GameDetailData } from "@/shared/server";

import { GameForm } from "./game-form";

interface EditGameFormProps {
  game: GameDetailData;
}

export function EditGameForm({ game }: EditGameFormProps) {
  return (
    <GameForm
      onSubmit={updateGame.bind(null, game.id)}
      defaultGame={game}
      submitLabel="수정 저장"
      successMessage="수정되었습니다"
      edit={{
        gameId: game.id,
        applicantCount: game.participants.length,
        confirmedCount: countConfirmed(game.participants),
      }}
    />
  );
}
