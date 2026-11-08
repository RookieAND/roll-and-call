import { getQuestClears } from "@roll-and-call/database/onboarding";
import { isAllQuestsCleared } from "@roll-and-call/database/onboarding/model";
import { Button, Card, Container, FloatingBar, VStack } from "@roll-and-call/ui";

import { getCurrentServer, getCurrentSessionUser } from "@/shared/server";
import { AppBar, PageShell, ServerLink } from "@/shared/ui";

import { QUEST_STATE, toQuestTracks } from "../model/quest-card";
import { AchievementSheet } from "./achievement-sheet";
import { MarkOnboardedOnMount } from "./mark-onboarded-on-mount";
import { QuestCard } from "./quest-card";
import { QuestGlanceCard } from "./quest-glance-card";
import { QuestHeroCard } from "./quest-hero-card";
import { QuestPanel } from "./quest-panel";
import { QuestProgress } from "./quest-progress";

interface QuestListViewProps {
  // 마이페이지에서 다시 보러 왔으면 하단에 [나가기], 아니면 [나중에 하기]가 선다.
  review: boolean;
  achievement: boolean;
}

export async function QuestListView({ review, achievement }: QuestListViewProps) {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  const cleared = user ? await getQuestClears({ serverId: server.id, userId: user.id }) : [];
  const cards = toQuestTracks(cleared).flatMap((track) => track.cards);
  const heroCard = cards.find((card) => card.state === QUEST_STATE.open);
  const allCleared = isAllQuestsCleared(cleared);
  const leave = review
    ? { label: "나가기", path: "/me" }
    : { label: "나중에 하기", path: "/games" };

  return (
    <PageShell
      readable
      appBar={<AppBar title="튜토리얼 퀘스트" />}
      panel={<QuestPanel clearedCount={cleared.length} allCleared={allCleared} />}
    >
      <Container size="sm">
        <VStack gap="150" className="px-050 pt-200 pb-250">
          <div className="desktop:hidden">
            <QuestProgress clearedCount={cleared.length} allCleared={allCleared} />
          </div>
          {heroCard && <QuestHeroCard card={heroCard} />}
          <Card.Root padding="none" radius={600} className="overflow-hidden">
            {cards
              .filter((card) => card !== heroCard)
              .map((card) => (
                <QuestCard key={card.quest} card={card} />
              ))}
          </Card.Root>
          <div className="desktop:hidden">
            <QuestGlanceCard defaultOpen={!review} />
          </div>
        </VStack>
      </Container>
      <FloatingBar.Root elevated={false}>
        {/* 데스크톱에서 바 띠를 카드 열(600px)에 맞추고 페이지 바탕색으로 둔다. */}
        <FloatingBar.Content className="desktop:left-[calc(var(--bar-left)+var(--spacing-250))] desktop:w-[calc(var(--bar-w)-2*var(--spacing-250))] desktop:bg-canvas desktop:px-0">
          <Button
            variant="outline"
            colorPalette="gray"
            size="lg"
            className="w-full"
            render={<ServerLink path={leave.path} />}
          >
            {leave.label}
          </Button>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
      <AchievementSheet open={achievement && allCleared} />
      <MarkOnboardedOnMount />
    </PageShell>
  );
}
