"use client";

import { GameForm } from "@/entities/game";
import type { Game } from "@/shared/api/db";
import { updateGame } from "../api/update-game";

export function EditGameForm({ game }: { game: Game }) {
  return (
    <GameForm
      action={updateGame.bind(null, game.id)}
      defaultGame={game}
      submitLabel="수정 저장"
    />
  );
}
