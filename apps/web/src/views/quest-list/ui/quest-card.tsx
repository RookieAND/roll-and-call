import { Badge, Button, Card, HStack, Text, VStack } from "@roll-and-call/ui";
import { Flag, Lock } from "lucide-react";

import { ServerLink } from "@/shared/ui";

import { QUEST_STATE, type QuestCardData, type QuestState } from "../model/quest-card";
import { QuestStamp } from "./quest-stamp";

const TILE_CLASS = {
  [QUEST_STATE.cleared]: "bg-success-50 text-success-700",
  [QUEST_STATE.open]: "bg-primary-50 text-primary-ink",
  [QUEST_STATE.locked]: "bg-gray-100 text-hint",
} as const satisfies Record<QuestState, string>;

const BODY_CLASS = {
  [QUEST_STATE.cleared]: "pr-23 opacity-55",
  [QUEST_STATE.open]: "",
  [QUEST_STATE.locked]: "opacity-60",
} as const satisfies Record<QuestState, string>;

interface QuestCardProps {
  card: QuestCardData;
  justCleared: boolean;
}

export function QuestCard({ card, justCleared }: QuestCardProps) {
  const cleared = card.state === QUEST_STATE.cleared;
  const locked = card.state === QUEST_STATE.locked;
  const open = card.state === QUEST_STATE.open;
  const actionLabel = open ? "시작하기" : "다시 해 보기";

  return (
    <Card.Root padding="md" radius={600}>
      <VStack gap="150" className="relative">
        <VStack gap="050" className={BODY_CLASS[card.state]}>
          <HStack align="center" gap="100">
            <span
              aria-hidden
              className={`flex size-8 flex-none items-center justify-center rounded-400 ${TILE_CLASS[card.state]}`}
            >
              <Flag size={18} strokeWidth={2.1} />
            </span>
            <Text typography="subtitle1" weight="extrabold" render={<h2 />}>
              {card.title}
            </Text>
            <Badge colorPalette={card.required ? "primary" : "gray"}>
              {card.required ? "필수" : "선택"}
            </Badge>
          </HStack>
          <Text typography="body3" foreground="muted" render={<p />}>
            {card.description}
          </Text>
          {locked && card.lockedReason && (
            <HStack align="start" gap="075" className="mt-050">
              <Lock size={15} aria-hidden className="mt-025 flex-none" />
              <Text typography="body4" weight="bold">
                {card.lockedReason}
              </Text>
            </HStack>
          )}
        </VStack>
        {cleared && <QuestStamp animate={justCleared} />}
        {!locked && (
          <Button
            variant={open ? "solid" : "outline"}
            colorPalette={open ? "primary" : "gray"}
            size="md"
            className="min-h-11 w-full"
            render={<ServerLink path={card.path} />}
          >
            {actionLabel}
          </Button>
        )}
      </VStack>
    </Card.Root>
  );
}
