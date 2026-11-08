import { Button, HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { Check, Lock } from "lucide-react";

import { ServerLink } from "@/shared/ui";

import { QUEST_STATE, type QuestCardData, type QuestState } from "../model/quest-card";
import { QUEST_ICON } from "./quest-icon";

const TILE_CLASS = {
  [QUEST_STATE.cleared]: "bg-success-50 text-success-800",
  [QUEST_STATE.open]: "bg-primary-50 text-tinted-ink",
  [QUEST_STATE.locked]: "bg-gray-100 text-hint",
} as const satisfies Record<QuestState, string>;

interface QuestCardProps {
  card: QuestCardData;
}

// 퀘스트 목록의 한 줄. 클리어한 줄도 눌러서 다시 해 볼 수 있다.
export function QuestCard({ card }: QuestCardProps) {
  const Icon = QUEST_ICON[card.quest];
  const cleared = card.state === QUEST_STATE.cleared;
  const locked = card.state === QUEST_STATE.locked;

  return (
    <HStack
      align="center"
      gap="150"
      className={cn(
        "relative min-h-14 border-t border-gray-200 px-200 py-100 first:border-t-0",
        locked && "opacity-60",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-8 flex-none items-center justify-center rounded-400",
          TILE_CLASS[card.state],
        )}
      >
        <Icon size={18} strokeWidth={2.1} />
      </span>
      <VStack gap="025" className="min-w-0 flex-1">
        {cleared ? (
          <Text
            typography="subtitle2"
            render={<ServerLink path={card.path} />}
            className="after:absolute after:inset-0"
          >
            {card.title}
          </Text>
        ) : (
          <Text typography="subtitle2">{card.title}</Text>
        )}
        {locked && card.lockedHint && (
          <HStack align="center" gap="050">
            <Lock size={14} aria-hidden className="flex-none text-hint" />
            <Text typography="body4" foreground="hint">
              {card.lockedHint}
            </Text>
          </HStack>
        )}
      </VStack>
      {cleared && (
        <HStack align="center" gap="050" className="text-success-800">
          <Check size={14} strokeWidth={3} aria-hidden />
          <Text typography="body3" weight="bold" foreground="inherit">
            클리어
          </Text>
        </HStack>
      )}
      {card.state === QUEST_STATE.open && (
        <Button
          variant="outline"
          colorPalette="primary"
          size="sm"
          render={<ServerLink path={card.path} />}
        >
          시작
        </Button>
      )}
    </HStack>
  );
}
