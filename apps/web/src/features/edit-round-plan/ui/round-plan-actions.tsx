"use client";

import { Button, Card, Text, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import { AddRoundSheet } from "./add-round-sheet";
import { FinishEarlyDialog } from "./finish-early-dialog";
import { PlanRow } from "./plan-row";
import { RoundCountSheet } from "./round-count-sheet";

interface RoundPlanActionsProps {
  gameId: string;
  roundCount: number;
  startedCount: number;
  designated: boolean;
  canAddRound: boolean;
  defaultMinutes: number;
}

// 회차 일정 화면의 「회차 계획」(예정 회차 수, 회차 추가)과 「구인 마치기」 섹션.
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
      <VStack gap="200">
        <VStack gap="075">
          <Text typography="subtitle2" render={<h3 />}>
            회차 계획
          </Text>
          <Card.Root
            radius={600}
            padding="none"
            className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-gray-200"
          >
            <PlanRow
              label="예정 회차 수 바꾸기"
              description={`지금 ${roundCount}회 · ${designated ? "줄일 수 있습니다" : "줄이거나 늘릴 수 있습니다"}`}
              onClick={() => setCounting(true)}
            />
            {designated && canAddRound && (
              <PlanRow
                label="회차 추가"
                description="맨 뒤에 회차를 하나 더 만듭니다"
                onClick={() => setAdding(true)}
              />
            )}
          </Card.Root>
        </VStack>
        {canFinish && (
          <VStack gap="075">
            <Text typography="subtitle2" render={<h3 />}>
              구인 마치기
            </Text>
            <Card.Root padding="md" radius={600}>
              <VStack gap="100">
                <Text typography="body3" foreground="muted">
                  남은 회차를 열지 않고 구인을 마칩니다.
                </Text>
                <Button variant="outline" colorPalette="danger" onClick={() => setFinishing(true)}>
                  여기서 마치기
                </Button>
              </VStack>
            </Card.Root>
          </VStack>
        )}
      </VStack>
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
