"use client";

import { Button, HStack, Text, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import { GAME_VISIBILITY, PrivateMark, type GameVisibility } from "@/entities/game";
import { ConfirmDialog, LineBreaks, useAction } from "@/shared/ui";

import { switchGameToPrivate } from "../api/make-game-private";

const CONFIRM_LINES = ["구인방의 모집 글이 삭제됩니다.", "신청을 받지 않게 됩니다."];

interface GameVisibilityRowProps {
  gameId: string;
  visibility: GameVisibility;
  // 바꿀 수 없는 이유. 바꿀 수 있으면 null이다. 비공개에서 공개로는 바꾸지 않는다.
  blockedReason: string | null;
}

export function GameVisibilityRow({ gameId, visibility, blockedReason }: GameVisibilityRowProps) {
  const [confirming, setConfirming] = useState(false);
  const { run, pending } = useAction();
  const isPrivate = visibility === GAME_VISIBILITY.private;
  const blocked = blockedReason !== null;

  function change() {
    run(() => switchGameToPrivate(gameId), { onSuccess: () => setConfirming(false) });
  }

  return (
    <>
      <HStack align="center" gap="150" className="min-h-16 px-175 py-150">
        <VStack gap="025" className="min-w-0 flex-1">
          <Text typography="subtitle1">모집 유형</Text>
          {blocked && (
            <Text typography="body4" foreground="muted" className="text-pretty break-keep">
              {blockedReason}
            </Text>
          )}
        </VStack>
        {isPrivate ? (
          <PrivateMark />
        ) : (
          <Text typography="body3" weight="medium" render={<span />}>
            일반 모집
          </Text>
        )}
        {!isPrivate && (
          <Button
            variant="ghost"
            size="sm"
            disabled={blocked}
            onClick={() => setConfirming(true)}
            className="min-h-11 px-050"
          >
            바꾸기
          </Button>
        )}
      </HStack>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="지정 모집으로 바꿀까요?"
        description={<LineBreaks lines={CONFIRM_LINES} />}
        confirmLabel="지정 모집으로 바꾸기"
        danger
        pending={pending}
        onConfirm={change}
      />
    </>
  );
}
