"use client";

import { VStack } from "@trpg/ui";
import { DeleteGameButton, updateGame } from "@/features/game";
import type { Game } from "@/shared/api/db";
import { GameForm } from "./game-form";

export function EditGameForm({ game }: { game: Game }) {
  return (
    <VStack gap={3}>
      <GameForm
        onSubmit={updateGame.bind(null, game.id)}
        defaultGame={game}
        submitLabel="수정 저장"
        successMessage="수정되었습니다"
      />
      <DeleteGameButton
        gameId={game.id}
        label="구인 삭제"
        className="h-[46px] w-full"
      />
    </VStack>
  );
}
