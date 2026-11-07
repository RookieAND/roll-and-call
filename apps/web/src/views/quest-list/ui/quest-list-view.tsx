import { getQuestClears } from "@roll-and-call/database/onboarding";
import { isAllQuestsCleared, isOnboardingQuest } from "@roll-and-call/database/onboarding/model";
import { Button, Container, FloatingBar, Text, VStack } from "@roll-and-call/ui";

import { getCurrentServer, getCurrentSessionUser } from "@/shared/server";
import { AppBar, PageShell, ServerLink } from "@/shared/ui";

import { QUEST_TRACK_LABEL, toQuestTracks } from "../model/quest-card";
import { AchievementSheet } from "./achievement-sheet";
import { MarkOnboardedOnMount } from "./mark-onboarded-on-mount";
import { QuestAchievementPreview } from "./quest-achievement-preview";
import { QuestCard } from "./quest-card";
import { QuestGlanceCard } from "./quest-glance-card";
import { QuestProgress } from "./quest-progress";

interface QuestListViewProps {
  // 마이페이지에서 다시 보러 왔으면 하단에 [나가기], 아니면 [나중에 하기]가 선다.
  review: boolean;
  justCleared: string | null;
  achievement: boolean;
}

export async function QuestListView({ review, justCleared, achievement }: QuestListViewProps) {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  const cleared = user ? await getQuestClears({ serverId: server.id, userId: user.id }) : [];
  const tracks = toQuestTracks(cleared);
  const allCleared = isAllQuestsCleared(cleared);
  const justClearedQuest = justCleared && isOnboardingQuest(justCleared) ? justCleared : null;
  const leave = review
    ? { label: "나가기", path: "/me" }
    : { label: "나중에 하기", path: "/games" };

  return (
    <PageShell readable appBar={<AppBar title="튜토리얼 퀘스트" />}>
      <Container size="sm">
        <VStack gap="150" className="px-050 pt-200 pb-250">
          <QuestProgress clearedCount={cleared.length} allCleared={allCleared} />
          <QuestGlanceCard defaultOpen={!review} />
          {tracks.map(({ track, cards }) => (
            <VStack key={track} gap="100" render={<section />} className="pt-050">
              <Text typography="body4" weight="medium" foreground="hint" render={<h2 />}>
                {QUEST_TRACK_LABEL[track]}
              </Text>
              {cards.map((card) => (
                <QuestCard
                  key={card.quest}
                  card={card}
                  justCleared={justClearedQuest === card.quest}
                />
              ))}
            </VStack>
          ))}
          <QuestAchievementPreview earned={allCleared} />
        </VStack>
      </Container>
      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
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
