import { Chip, HStack, Text, VStack } from "@roll-and-call/ui";
import { MessageSquare, Mic } from "lucide-react";

import { PLAY_TYPE, playTypeLabel, type PlayType } from "@/entities/game";

interface PlayTypeBlockProps {
  playType: PlayType;
}

export function PlayTypeBlock({ playType }: PlayTypeBlockProps) {
  const icons = {
    [PLAY_TYPE.voice]: [Mic],
    [PLAY_TYPE.text]: [MessageSquare],
    [PLAY_TYPE.both]: [Mic, MessageSquare],
  }[playType];
  return (
    <VStack gap="100">
      <Text typography="subtitle2" className="desktop:text-heading2" render={<h2 />}>
        플레이 유형
      </Text>
      <HStack>
        <Chip tone="outline" render={<span />} className="gap-050">
          {icons.map((Icon, index) => (
            <Icon key={index} size={14} strokeWidth={2} aria-hidden />
          ))}
          {playTypeLabel(playType)}
        </Chip>
      </HStack>
    </VStack>
  );
}
