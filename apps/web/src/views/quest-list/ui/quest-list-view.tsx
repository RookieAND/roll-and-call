import {
  isAllQuestsCleared,
  isOnboardingQuest,
  ONBOARDING_QUEST,
} from "@roll-and-call/database/onboarding/model";
import { Badge, Container, FloatingBar, Button, Text, VStack, HStack } from "@roll-and-call/ui";

import { FinishOnboardingButton } from "@/features/finish-onboarding";
import { getCurrentServer, getCurrentSessionUser, getQuestClears } from "@/shared/server";
import { AppBar, ServerLink } from "@/shared/ui";

import { toQuestCards } from "../model/quest-card";
import { AchievementSheet } from "./achievement-sheet";
import { QuestCard } from "./quest-card";

interface QuestListViewProps {
  // 마이페이지에서 다시 보러 왔으면 [나가기], 처음이면 [온보딩 마치기]가 하단에 선다.
  review: boolean;
  justCleared: string | null;
  achievement: boolean;
}

export async function QuestListView({ review, justCleared, achievement }: QuestListViewProps) {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  const cleared = user ? await getQuestClears({ serverId: server.id, userId: user.id }) : [];
  const cards = toQuestCards(cleared);
  const allCleared = isAllQuestsCleared(cleared);
  const firstApplyCleared = cleared.includes(ONBOARDING_QUEST.firstApply);
  const justClearedQuest = justCleared && isOnboardingQuest(justCleared) ? justCleared : null;

  return (
    <>
      <AppBar
        title="튜토리얼 퀘스트"
        action={
          <Text typography="body4" foreground="hint" numeric className="px-100">
            {cleared.length} / 4
          </Text>
        }
      />
      <Container size="sm">
        <VStack gap="150" className="px-050 pt-200 pb-250">
          <HStack align="center" gap="075" wrap>
            <Text typography="body3" foreground="hint">
              {allCleared ? "" : "모두 깨면"}
            </Text>
            <Badge colorPalette="gray">🧭 견습 모험가</Badge>
            <Text typography="body3" foreground="hint">
              {allCleared ? "업적을 받았습니다." : "업적을 받습니다."}
            </Text>
          </HStack>
          {cards.map((card) => (
            <QuestCard key={card.quest} card={card} justCleared={justClearedQuest === card.quest} />
          ))}
        </VStack>
      </Container>
      {(review || firstApplyCleared) && (
        <FloatingBar.Root elevated={false}>
          <FloatingBar.Content>
            <Container size="sm">
              {review ? (
                <Button
                  variant="outline"
                  colorPalette="gray"
                  size="lg"
                  className="w-full"
                  render={<ServerLink path="/me" />}
                >
                  나가기
                </Button>
              ) : (
                <FinishOnboardingButton />
              )}
            </Container>
          </FloatingBar.Content>
          <FloatingBar.Spacer />
        </FloatingBar.Root>
      )}
      <AchievementSheet open={achievement && allCleared} />
    </>
  );
}
