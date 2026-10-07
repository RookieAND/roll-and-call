"use client";

import { Button, Callout, FloatingBar, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useState } from "react";

import { coordinationWindowOf } from "@/entities/game";
import { buildDayColumns, buildTimeRows, toKst } from "@/shared/lib";
import { ConfirmDialog, toast, useAction } from "@/shared/ui";

import { confirmSession } from "../api/confirm-session";
import type { ConfirmSessionGame } from "../model/confirm-session-game";
import { initialSessionStart } from "../model/initial-session-start";
import { sessionStartIso } from "../model/session-start-iso";
import { sessionWindowLabel } from "../model/session-window-label";
import { ConfirmSessionDialogBody } from "./confirm-session-dialog-body";
import { SessionTimeFields } from "./session-time-fields";
import { SessionWindowSummary } from "./session-window-summary";

interface ConfirmSessionFormProps {
  game: ConfirmSessionGame;
}

export function ConfirmSessionForm({ game }: ConfirmSessionFormProps) {
  const { id: gameId, playMinutes, confirmedAt } = game;
  const days = buildDayColumns({ rangeStart: game.rangeStart, rangeEnd: game.rangeEnd });
  const window = coordinationWindowOf(game);
  const changing = !isNull(confirmedAt);

  const [start, setStart] = useState(() =>
    initialSessionStart({
      seedIso: confirmedAt?.toISOString() ?? null,
      rangeStart: game.rangeStart,
      window,
      timeRows: buildTimeRows(window),
    }),
  );
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { pending, run } = useAction();

  const startIso = sessionStartIso(start);
  const startLabel = toKst(startIso).format("M/D (dd) HH:mm");

  function submit() {
    setError(null);
    run(() => confirmSession({ gameId, slotIso: startIso }), {
      onSuccess: () => {
        setConfirming(false);
        toast.success(changing ? "확정 시간을 바꿨습니다" : "세션이 확정되었습니다");
      },
      onError: (result) => {
        setError(result.error);
        setConfirming(false);
      },
    });
  }

  const windowLabel = sessionWindowLabel({ iso: startIso, playMinutes });

  return (
    <VStack gap="250">
      <VStack gap="125" render={<section />}>
        <Text typography="subtitle2" render={<h2 />}>
          세션 시간
        </Text>
        <SessionTimeFields days={days} window={window} start={start} onChange={setStart} />
        <SessionWindowSummary windowLabel={windowLabel} />
      </VStack>

      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          {error && (
            <Callout.Root colorPalette="danger" size="sm" className="mb-125">
              <Callout.Icon />
              <Callout.Description>{error}</Callout.Description>
            </Callout.Root>
          )}
          <Button
            variant="solid"
            colorPalette="success"
            size="lg"
            className="w-full"
            onClick={() => setConfirming(true)}
          >
            {startLabel}
            {changing ? "으로 변경" : "으로 확정"}
          </Button>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={changing ? "확정 시간을 바꿀까요?" : "이 시간으로 확정할까요?"}
        confirmLabel={changing ? "변경" : "확정"}
        confirmColorPalette="success"
        pending={pending}
        onConfirm={submit}
      >
        <ConfirmSessionDialogBody
          windowLabel={windowLabel}
          changing={changing}
          confirmedCount={game.confirmedCount}
          maxPlayers={game.maxPlayers}
        />
      </ConfirmDialog>
    </VStack>
  );
}
