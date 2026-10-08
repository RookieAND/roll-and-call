import { Badge, HStack, Text, VStack } from "@roll-and-call/ui";

import { playTypeLabel, type PlayType } from "@/entities/game";

interface PlayTypeBlockProps {
  playType: PlayType;
}

export function PlayTypeBlock({ playType }: PlayTypeBlockProps) {
  return (
    <VStack gap="100">
      <Text typography="subtitle2" render={<h2 />}>
        플레이 유형
      </Text>
      <HStack>
        <Badge>{playTypeLabel(playType)}</Badge>
      </HStack>
    </VStack>
  );
}
