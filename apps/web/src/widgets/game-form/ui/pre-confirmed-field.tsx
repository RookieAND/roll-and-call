"use client";

import { Button, Card, HStack, Text, VStack } from "@roll-and-call/ui";
import { Plus } from "lucide-react";
import { useState } from "react";

import { DirectConfirmSheet } from "@/features/adjust-roster";
import type { PreConfirmedPlayer } from "@/features/write-game";

import { countPeople } from "../model/count-people";
import { PreConfirmedRow } from "./pre-confirmed-row";

interface PreConfirmedFieldProps {
  players: readonly PreConfirmedPlayer[];
  maxPlayers: number;
  isLottery: boolean;
  onRemove: (userId: string) => void;
  onAdd: (players: PreConfirmedPlayer[]) => void;
}

// 구인을 올리는 순간 확정될 사람을 미리 고른다. 남은 자리로 공개 모집이 열린다.
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
  const hint =
    count === 0
      ? "신청을 받지 않고 바로 함께할 사람이 있으면 넣어 주세요."
      : isLottery
        ? `직접 확정한 ${countPeople(count)}은 추첨에서 빠지고, 남은 ${openSeats}자리를 두고 추첨합니다.`
        : `구인을 올리면 ${countPeople(count)}이 바로 확정되고, 남은 ${openSeats}자리로 공개 모집합니다.`;

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
