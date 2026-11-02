import { Chip, HStack, Text, VStack } from "@roll-and-call/ui";
import { MessageSquare, Mic } from "lucide-react";

import { PLAY_TYPE, playTypeLabel, type PlayType } from "@/entities/game";

const VOICE_CHIP = { type: PLAY_TYPE.voice, Icon: Mic } as const;
const TEXT_CHIP = { type: PLAY_TYPE.text, Icon: MessageSquare } as const;
const PLAY_TYPE_CHIPS = {
  [PLAY_TYPE.voice]: [VOICE_CHIP],
  [PLAY_TYPE.text]: [TEXT_CHIP],
  [PLAY_TYPE.both]: [VOICE_CHIP, TEXT_CHIP],
} as const;

interface PlayTypeBlockProps {
  playType: PlayType;
}

export function PlayTypeBlock({ playType }: PlayTypeBlockProps) {
  const chips = PLAY_TYPE_CHIPS[playType];
  return (
    <VStack gap="100">
      <Text typography="subtitle1" render={<h2 />}>
        플레이 유형
      </Text>
      <HStack gap="075" wrap>
        {chips.map(({ type, Icon }) => (
          <Chip key={type} tone="outline" render={<span />} className="gap-050">
            <Icon size={14} strokeWidth={2} aria-hidden />
            {playTypeLabel(type)}
          </Chip>
        ))}
      </HStack>
    </VStack>
  );
}
