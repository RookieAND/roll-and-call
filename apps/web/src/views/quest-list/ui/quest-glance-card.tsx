"use client";

import { Button, Card, HStack, Text, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import { QUEST_TRACK_LABEL } from "../model/quest-card";
import { QUEST_FLOWS } from "../model/quest-flows";
import { QuestFlowRow } from "./quest-flow-row";

interface QuestGlanceCardProps {
  // 처음 들어오면 펼쳐 있고, 마이페이지에서 다시 보러 오면 접혀 있다. 접은 상태는 저장하지 않는다.
  defaultOpen: boolean;
}

export function QuestGlanceCard({ defaultOpen }: QuestGlanceCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const toggleLabel = open ? "접기" : "펼치기";
  return (
    <Card.Root background="subtle" padding="none" radius={500}>
      <VStack gap="150" className="p-200">
        <HStack align="center" justify="between" gap="100" className="-my-100 -mr-100 min-h-11">
          <Text typography="heading3" render={<h2 />}>
            서비스 한눈에 보기
          </Text>
          <Button
            variant="ghost"
            colorPalette="gray"
            size="lg"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {toggleLabel}
          </Button>
        </HStack>
        {open && (
          <VStack gap="150">
            {QUEST_FLOWS.map((flow) => (
              <QuestFlowRow
                key={flow.track}
                label={QUEST_TRACK_LABEL[flow.track]}
                steps={flow.steps}
              />
            ))}
            <Text typography="body4" foreground="muted" render={<p />}>
              아래 퀘스트로 이 흐름을 한 번씩 겪어 봅니다.
            </Text>
          </VStack>
        )}
      </VStack>
    </Card.Root>
  );
}
