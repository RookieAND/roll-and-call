import type { Game } from "@roll-and-call/database";
import { Badge, Card, HStack, Text, VStack } from "@roll-and-call/ui";

import type { ParticipantStatus } from "../model/participant";
import { pastGameCardView } from "../model/past-game-card-view";
import { GameStatusBadge } from "./game-status-badge";
import { GameThumbnail } from "./game-thumbnail";
import { PastGameDesktopCard } from "./past-game-desktop-card";
import { PrivateMark } from "./private-mark";

interface PastGameCardProps {
  game: Game & {
    participants: { userId: string; status: ParticipantStatus }[];
  };
}

// 스포일러 썸네일은 작게라도 드러내지 않는다.
export function PastGameCard({ game }: PastGameCardProps) {
  const view = pastGameCardView(game);

  return (
    <>
      <Card.Root interactive padding="sm" className="desktop:hidden">
        <HStack align="center" gap="150">
          {view.thumbnailUrl ? (
            <GameThumbnail
              url={view.thumbnailUrl}
              sizes="56px"
              className="size-14 flex-none rounded-400 grayscale"
            />
          ) : (
            <span className="size-14 flex-none rounded-400 bg-gray-100" />
          )}
          <VStack gap="050" className="min-w-0 flex-1">
            <HStack align="center" gap="075">
              <Text truncate typography="subtitle1" foreground="muted" className="min-w-0 flex-1">
                {game.title}
              </Text>
              {view.grayBadge ? (
                <Badge colorPalette="gray">{view.grayBadge}</Badge>
              ) : (
                <GameStatusBadge status={view.status} />
              )}
            </HStack>
            <HStack align="center" gap="100" className="flex-wrap">
              <Text truncate typography="body4" foreground="muted" className="min-w-0">
                {view.meta}
              </Text>
              {view.isPrivate && <PrivateMark />}
            </HStack>
          </VStack>
        </HStack>
      </Card.Root>
      <PastGameDesktopCard title={game.title} view={view} />
    </>
  );
}
