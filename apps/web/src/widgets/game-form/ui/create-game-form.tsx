"use client";

import { createGame } from "@/features/write-game";
import { GameForm } from "./game-form";

export function CreateGameForm() {
  return (
    <GameForm
      wizard
      onSubmit={createGame}
      submitLabel="구인 등록"
      successMessage="구인이 등록되었습니다"
    />
  );
}
