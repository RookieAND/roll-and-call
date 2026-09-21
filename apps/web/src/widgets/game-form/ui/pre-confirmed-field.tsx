"use client";

import { Button, HStack, Text, VStack } from "@trpg/ui";
import { Plus } from "lucide-react";
import { useState } from "react";

import { DirectConfirmSheet } from "@/features/adjust-roster";
import type { PreConfirmedPlayer } from "@/features/write-game";

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
      ? ["신청을 받지 않고 바로 함께할 사람이 있으면 넣어 주세요."]
      : isLottery
        ? [
            `직접 확정한 ${count}명은 추첨에서 빠집니다.`,
            `남은 ${openSeats}자리를 두고 추첨합니다.`,
          ]
        : [
            `구인을 올리면 ${count}명이 바로 확정됩니다.`,
            `공개 모집은 남은 ${openSeats}자리로 열립니다.`,
          ];

  return (
    <VStack gap="100">
      <HStack align="baseline" justify="between" gap="100">
        <Text typography="body4" weight="bold">
          직접 확정한 참여자
        </Text>
        {count > 0 && (
          <Text numeric typography="body4" weight="bold" foreground="muted">
            {count}명
          </Text>
        )}
      </HStack>

      {count > 0 && (
        <VStack
          gap={0}
          render={<ul />}
          className="m-0 list-none divide-y divide-gray-100 overflow-hidden rounded-400 border border-gray-200 p-0"
        >
          {players.map((player) => (
            <PreConfirmedRow
              key={player.userId}
              player={player}
              onRemove={() => onRemove(player.userId)}
            />
          ))}
        </VStack>
      )}

      {/* ponytail: 시안의 점선 추가 버튼. Button에 dashed 변형이 없어 outline에 덧칠한다. */}
      <Button
        type="button"
        variant="outline"
        onClick={() => setPicking(true)}
        disabled={openSeats === 0}
        className="h-11 gap-075 rounded-400 border-dashed border-gray-300 text-subtitle2 font-bold text-primary-ink"
      >
        <Plus size={15} strokeWidth={2.6} aria-hidden />
        직접 확정
      </Button>

      <Text typography="body4" foreground="hint" render={<p />} className="leading-[1.55]">
        {hint.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
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
