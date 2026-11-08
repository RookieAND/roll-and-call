import { Button, Card, Text, VStack } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

import type { QuestCardData } from "../model/quest-card";

interface QuestHeroCardProps {
  card: QuestCardData;
}

export function QuestHeroCard({ card }: QuestHeroCardProps) {
  return (
    <Card.Root padding="lg" radius={600} className="border-[1.5px] border-primary-600">
      <VStack gap="100">
        <Text typography="body4" foreground="primary" weight="bold">
          다음 퀘스트
        </Text>
        <Text typography="heading1" render={<h3 />}>
          {card.title}
        </Text>
        <Text typography="body2" foreground="muted" render={<p />}>
          {card.learn} ({card.duration})
        </Text>
        <Button
          variant="solid"
          colorPalette="primary"
          size="lg"
          className="min-h-11 w-full"
          render={<ServerLink path={card.path} />}
        >
          시작하기
        </Button>
      </VStack>
    </Card.Root>
  );
}
