"use client";

import { isNull } from "es-toolkit";

import { countConfirmed, deriveGameStatus } from "@/entities/game";
import type { MyRulebooks } from "@/entities/rulebook";
import { updateGame } from "@/features/write-game";
import type { GameDetailData } from "@/shared/server";

import { GameForm } from "./game-form";

interface EditGameFormProps {
  serverId: string;
  game: GameDetailData;
  rulebooks: MyRulebooks;
}

export function EditGameForm({ serverId, game, rulebooks }: EditGameFormProps) {
  const confirmedCount = countConfirmed(game.participants);
  return (
    <GameForm
      serverId={serverId}
      onSubmit={updateGame.bind(null, game.id)}
      defaultGame={game}
      supplementRulebooks={rulebooks}
      submitLabel="수정 저장"
      successMessage="수정되었습니다"
      edit={{
        gameId: game.id,
        applicantCount: game.participants.length,
        confirmedCount,
        drawn: !isNull(game.drawnAt),
        minPlayers: game.minPlayers,
        status: deriveGameStatus({
          maxPlayers: game.maxPlayers,
          endDate: game.endDate,
          participantCount: confirmedCount,
          waitlistEnabled: game.waitlistEnabled,
          scheduleMode: game.scheduleMode,
          confirmedAt: game.confirmedAt,
          cancelledAt: game.cancelledAt,
        }),
      }}
    />
  );
}
