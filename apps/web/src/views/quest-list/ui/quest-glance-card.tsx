"use client";

import { Card, Collapsible, HStack, Text, VStack } from "@roll-and-call/ui";
import { ChevronDown } from "lucide-react";

import { QUEST_TRACK_LABEL } from "../model/quest-card";
import { QUEST_FLOWS } from "../model/quest-flows";
import { QuestFlowList } from "./quest-flow-list";

interface QuestGlanceCardProps {
  // 처음 들어오면 펼쳐 있고, 마이페이지에서 다시 보러 오면 접혀 있다. 접은 상태는 저장하지 않는다.
  defaultOpen: boolean;
}

export function QuestGlanceCard({ defaultOpen }: QuestGlanceCardProps) {
  return (
    <Card.Root background="subtle" padding="none" radius={500} className="overflow-hidden">
      <Collapsible.Root defaultOpen={defaultOpen}>
        <Collapsible.Trigger className="group block min-h-12 w-full cursor-pointer px-200 text-left">
          <HStack align="center" gap="100" className="min-h-12">
            <Text typography="subtitle2" render={<h2 />} className="min-w-0 flex-1">
              서비스 한눈에 보기
            </Text>
            <ChevronDown
              size={18}
              aria-hidden
              className="flex-none text-hint transition-transform group-data-panel-open:rotate-180"
            />
          </HStack>
        </Collapsible.Trigger>
        <Collapsible.Panel>
          <VStack gap="100" className="px-200 pb-200">
            {QUEST_FLOWS.map((flow) => (
              <QuestFlowList
                key={flow.track}
                label={QUEST_TRACK_LABEL[flow.track]}
                steps={flow.steps}
              />
            ))}
          </VStack>
        </Collapsible.Panel>
      </Collapsible.Root>
    </Card.Root>
  );
}
