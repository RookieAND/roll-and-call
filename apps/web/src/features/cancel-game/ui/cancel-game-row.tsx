"use client";

import { Button, Text, VStack } from "@roll-and-call/ui";
import { Ban, ChevronRight } from "lucide-react";
import { useState } from "react";

import { IconTile } from "@/shared/ui";

import { CancelGameDialog } from "./cancel-game-dialog";

interface CancelGameRowProps {
  gameId: string;
  notifyCount: number;
  lockedReason?: string;
}

export function CancelGameRow({ gameId, notifyCount, lockedReason }: CancelGameRowProps) {
  const [confirming, setConfirming] = useState(false);
  const locked = Boolean(lockedReason);
  const labelForeground = locked ? "hint" : "danger";
  const iconTone = locked ? "locked" : "danger";

  return (
    <>
      <Button
        variant="ghost"
        className="flex min-h-16 w-full justify-start gap-150 rounded-none px-175 py-150 hover:bg-danger-50 disabled:opacity-100"
        disabled={locked}
        onClick={() => setConfirming(true)}
      >
        <IconTile icon={Ban} tone={iconTone} />
        <VStack gap="025" render={<span />} className="min-w-0 flex-1 text-left">
          <Text typography="subtitle1" foreground={labelForeground}>
            구인 취소
          </Text>
          <Text typography="body4" foreground="hint">
            {lockedReason ?? "구인을 취소하고 확정자·대기자에게 알립니다"}
          </Text>
        </VStack>
        {!locked && <ChevronRight size={17} className="flex-none text-hint" aria-hidden />}
      </Button>

      <CancelGameDialog
        gameId={gameId}
        notifyCount={notifyCount}
        open={confirming}
        onOpenChange={setConfirming}
      />
    </>
  );
}
