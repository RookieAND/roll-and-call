"use client";

import { Button, Card, HStack, Text, VStack } from "@roll-and-call/ui";
import { Plus } from "lucide-react";
import { useState } from "react";

import { DirectConfirmSheet } from "@/features/adjust-roster";
import type { PreConfirmedPlayer } from "@/features/write-game";

import { preConfirmedHint } from "../model/pre-confirmed-hint";
import { PreConfirmedRow } from "./pre-confirmed-row";

interface PreConfirmedFieldProps {
  players: readonly PreConfirmedPlayer[];
  maxPlayers: number;
  isLottery: boolean;
  onRemove: (userId: string) => void;
  onAdd: (players: PreConfirmedPlayer[]) => void;
}

export function PreConfirmedField({
  players,
  maxPlayers,
  isLottery,
  onRemove,
  onAdd,
}: PreConfirmedFieldProps) {
  const [picking, setPicking] = useState(false);
  const count = players.length;
  const openSeats = Math.max(maxPlayers - count, 0);
  const hint = preConfirmedHint({ count, openSeats, isLottery });

  return (
    <VStack gap="100">
      <HStack align="baseline" justify="between" gap="100">
        <Text typography="body4" weight="bold">
          직접 확정한 참여자
        </Text>
        {count > 0 && (
          <Text numeric typography="body4" foreground="hint">
            {count}명
          </Text>
        )}
      </HStack>

      {count > 0 && (
        <Card.Root
          padding="none"
          radius={500}
          render={<ul />}
          className="m-0 list-none overflow-hidden p-0 [&>*+*]:border-t [&>*+*]:border-gray-200"
        >
          {players.map((player) => (
            <PreConfirmedRow
              key={player.userId}
              player={player}
              onRemove={() => onRemove(player.userId)}
            />
          ))}
        </Card.Root>
      )}

      <Button
        type="button"
        variant="tinted"
        onClick={() => setPicking(true)}
        disabled={openSeats === 0}
        className="h-11 w-full"
      >
        <Plus size={15} strokeWidth={2.6} aria-hidden />
        참여자 추가
      </Button>

      <Text typography="body4" foreground="hint" render={<p />} className="text-pretty">
        {hint}
      </Text>

      <DirectConfirmSheet
        open={picking}
        onOpenChange={setPicking}
        confirmedCount={count}
        maxPlayers={maxPlayers}
        excludeIds={players.map((player) => player.userId)}
        onPick={(candidates) => onAdd(candidates.map(({ status: _status, ...player }) => player))}
      />
    </VStack>
  );
}
