import { Card, Text, VStack } from "@roll-and-call/ui";

import { QUEST_TRACK_LABEL } from "../model/quest-card";
import { QUEST_FLOWS } from "../model/quest-flows";
import { QuestAchievementPreview } from "./quest-achievement-preview";
import { QuestFlowList } from "./quest-flow-list";
import { QuestPanelProgress } from "./quest-panel-progress";
import { QuestSectionLabel } from "./quest-section-label";

interface QuestPanelProps {
  clearedCount: number;
  allCleared: boolean;
}

// 1100px 이상 오른쪽 패널. 진행 상황·서비스 한눈에 보기(늘 펼침)·보상을 모아, 왼쪽 열에는 퀘스트 카드만 남긴다.
// 윗면을 왼쪽 첫 섹션 라벨(「참여하기」) 줄에 맞추려고 본문 위 여백(pt-200 + pt-050)만큼 내린다. sticky top은 PageShell 값 그대로다.
export function QuestPanel({ clearedCount, allCleared }: QuestPanelProps) {
  return (
    <VStack gap="200" className="mt-250">
      <QuestPanelProgress clearedCount={clearedCount} />
      <Card.Root padding="md" radius={600} render={<section />}>
        <VStack gap="200">
          <Text typography="heading3" render={<h2 />}>
            서비스 한눈에 보기
          </Text>
          {QUEST_FLOWS.map((flow) => (
            <QuestFlowList
              key={flow.track}
              label={QUEST_TRACK_LABEL[flow.track]}
              steps={flow.steps}
            />
          ))}
          <Text typography="body4" foreground="muted" render={<p />}>
            왼쪽 퀘스트로 이 흐름을 한 번씩 겪어 봅니다.
          </Text>
        </VStack>
      </Card.Root>
      <VStack gap="100" render={<section />}>
        <QuestSectionLabel>보상</QuestSectionLabel>
        <QuestAchievementPreview earned={allCleared} />
      </VStack>
    </VStack>
  );
}
