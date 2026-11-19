"use client";

import { Button, HStack } from "@roll-and-call/ui";
import { useState } from "react";

import { AddRoundSheet } from "./add-round-sheet";
import { FinishEarlyDialog } from "./finish-early-dialog";
import { RoundCountSheet } from "./round-count-sheet";

interface RoundPlanActionsProps {
  gameId: string;
  roundCount: number;
  startedCount: number;
  designated: boolean;
  canAddRound: boolean;
  defaultMinutes: number;
}

// 회차 일정 화면 아래 글자 버튼 셋: 예정 회차 수 바꾸기, 회차 추가(지정형), 여기서 마치기.
export function RoundPlanActions({
  gameId,
  roundCount,
  startedCount,
  designated,
  canAddRound,
  defaultMinutes,
}: RoundPlanActionsProps) {
  const [counting, setCounting] = useState(false);
  const [adding, setAdding] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const canFinish = startedCount > 0;

  return (
    <>
      <HStack gap="050" wrap justify="center">
        <Button variant="ghost" size="sm" onClick={() => setCounting(true)}>
          예정 회차 수 바꾸기
        </Button>
        {designated && canAddRound && (
          <Button variant="ghost" size="sm" onClick={() => setAdding(true)}>
            회차 추가
          </Button>
        )}
        {canFinish && (
          <Button
            variant="ghost"
            colorPalette="danger"
            size="sm"
            onClick={() => setFinishing(true)}
          >
            여기서 마치기
          </Button>
        )}
      </HStack>
      <RoundCountSheet
        gameId={gameId}
        open={counting}
        onOpenChange={setCounting}
        roundCount={roundCount}
        startedCount={startedCount}
        designated={designated}
        onFinish={() => setFinishing(true)}
      />
      <AddRoundSheet
        gameId={gameId}
        open={adding}
        onOpenChange={setAdding}
        defaultMinutes={defaultMinutes}
      />
      <FinishEarlyDialog gameId={gameId} open={finishing} onOpenChange={setFinishing} />
    </>
  );
}
