"use client";

import { GameForm } from "@/entities/game";
import { createGame } from "../api/create-game";

export function CreateGameForm() {
  return <GameForm action={createGame} submitLabel="구인 등록" />;
}
