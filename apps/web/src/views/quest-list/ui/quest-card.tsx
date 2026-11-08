import { Button, Card, HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { Clock, Lock } from "lucide-react";

import { ServerLink } from "@/shared/ui";

import { QUEST_STATE, type QuestCardData, type QuestState } from "../model/quest-card";
import { QUEST_ICON } from "./quest-icon";
import { QuestStamp } from "./quest-stamp";

const TILE_CLASS = {
  [QUEST_STATE.cleared]: "bg-success-50 text-success-800",
  [QUEST_STATE.open]: "bg-primary-50 text-tinted-ink",
  [QUEST_STATE.locked]: "bg-gray-100 text-hint",
} as const satisfies Record<QuestState, string>;

// 클리어 카드는 흐리게 하지 않는다. 오른쪽은 스탬프 자리만 비운다.
const BODY_CLASS = {
  [QUEST_STATE.cleared]: "",
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
  const Icon = QUEST_ICON[card.quest];
  const titleRowClass = cleared ? "pr-23" : undefined;

  return (
    <Card.Root padding="md" radius={600}>
      <VStack gap="150" className="relative">
        <VStack gap="075" className={BODY_CLASS[card.state]}>
          <HStack align="center" gap="100" className={titleRowClass}>
            <span
              aria-hidden
              className={cn(
                "flex size-8 flex-none items-center justify-center rounded-400",
                TILE_CLASS[card.state],
              )}
            >
              <Icon size={18} strokeWidth={2.1} />
            </span>
            <Text typography="subtitle1" weight="extrabold" render={<h3 />}>
              {card.title}
            </Text>
          </HStack>
          <Text typography="body3" foreground="muted" render={<p />}>
            {card.learn}
          </Text>
          <HStack
            align="center"
            gap="050"
            className="self-start rounded-full bg-gray-50 px-100 py-025 text-gray-600"
          >
            <Clock size={12} strokeWidth={2.2} aria-hidden />
            <Text typography="body4" foreground="muted">
              {card.duration}
            </Text>
          </HStack>
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
        {open && (
          <Button
            variant="solid"
            colorPalette="primary"
            size="md"
            className="min-h-11 w-full"
            render={<ServerLink path={card.path} />}
          >
            시작하기
          </Button>
        )}
        {cleared && (
          <Button
            variant="outline"
            colorPalette="gray"
            size="md"
            className="min-h-11 w-full"
            render={<ServerLink path={card.path} />}
          >
            다시 해 보기
          </Button>
        )}
      </VStack>
    </Card.Root>
  );
}
