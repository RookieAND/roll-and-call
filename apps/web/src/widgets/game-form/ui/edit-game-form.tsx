"use client";

import type { GameDetailData } from "@roll-and-call/database/games";
import { isNull } from "es-toolkit";

import { countConfirmed, deriveGameStatus, isSessionStarted } from "@/entities/game";
import type { MyRulebooks } from "@/entities/rulebook";
import { updateGame } from "@/features/write-game";

import { GameForm } from "./game-form";

interface EditGameFormProps {
  serverId: string;
  game: GameDetailData;
  rulebooks: MyRulebooks;
  adultOnlyEnabled: boolean;
}

export function EditGameForm({ serverId, game, rulebooks, adultOnlyEnabled }: EditGameFormProps) {
  const confirmedCount = countConfirmed(game.participants);
  return (
    <GameForm
      serverId={serverId}
      onSubmit={updateGame.bind(null, game.id)}
      defaultGame={game}
      supplementRulebooks={rulebooks}
      adultOnlyEnabled={adultOnlyEnabled}
      submitLabel="수정 저장"
      successMessage="수정되었습니다"
      edit={{
        gameId: game.id,
        applicantCount: game.participants.length,
        started: isSessionStarted(game),
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
