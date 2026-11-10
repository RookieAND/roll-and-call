import type { Game } from "@roll-and-call/database";
import { Badge, Card, HStack, Text, VStack } from "@roll-and-call/ui";

import type { ParticipantStatus } from "../model/participant";
import { pastGameCardView } from "../model/past-game-card-view";
import { GameCapacity } from "./game-capacity";
import { GameCardScheduleRow } from "./game-card-schedule-row";
import { GameGmLabel } from "./game-gm-label";
import { GameStatusBadge } from "./game-status-badge";
import { GameThumbnail } from "./game-thumbnail";

interface PastGameCardProps {
  game: Game & {
    gm: { username: string; avatarUrl: string | null } | null;
    participants: { userId: string; status: ParticipantStatus }[];
  };
}

// 진행 중 카드와 같은 배치로 룰·플레이 시간, 일정, GM·모집 유형·인원을 나눈다.
export function PastGameCard({ game }: PastGameCardProps) {
  const view = pastGameCardView(game);
  return (
    <Card.Root
      interactive
      padding="none"
      className="h-full overflow-hidden rounded-600 desktop:flex desktop:flex-col"
    >
      {view.thumbnailUrl ? (
        <GameThumbnail
          url={view.thumbnailUrl}
          sizes="(max-width: 412px) 100vw, 412px"
          className="aspect-video w-full grayscale"
        />
      ) : (
        <span className="block aspect-video w-full flex-none bg-gray-100" />
      )}
      <VStack gap="125" className="px-175 pt-175 desktop:flex-1">
        <VStack gap="075" className="desktop:flex-1">
          <HStack align="center" gap="100" className="desktop:flex-wrap desktop:gap-075">
            <Text
              typography="heading2"
              foreground="muted"
              className="line-clamp-2 min-w-0 flex-1 desktop:order-2 desktop:line-clamp-none desktop:basis-full desktop:text-heading3 desktop:font-bold desktop:text-pretty"
            >
              {game.title}
            </Text>
            <HStack gap="075" className="shrink-0 desktop:order-0">
              {view.grayBadge ? (
                <Badge colorPalette="gray">{view.grayBadge}</Badge>
              ) : (
                <GameStatusBadge status={view.status} />
              )}
              {view.isPrivate && <Badge colorPalette="gray">지정 모집</Badge>}
            </HStack>
          </HStack>
          {view.meta && (
            <Text
              truncate
              typography="body3"
              foreground="muted"
              className="desktop:overflow-visible desktop:text-clip desktop:whitespace-normal"
            >
              {view.meta}
            </Text>
          )}
        </VStack>
        <GameCardScheduleRow text={view.schedule} />
      </VStack>
      <HStack
        align="center"
        gap="100"
        className="mx-175 mt-150 border-t border-gray-200 pt-125 pb-150 desktop:border-t-0 desktop:pt-0 desktop:pb-175"
      >
        <GameGmLabel name={game.gm?.username} avatarUrl={game.gm?.avatarUrl} />
        <GameCapacity
          status={view.status}
          recruitMethod={game.recruitMethod}
          confirmed={view.confirmedCount}
          waiting={game.participants.length - view.confirmedCount}
          maxPlayers={game.maxPlayers}
          ended={view.grayBadge === "종료"}
          isPrivate={view.isPrivate}
          past
        />
      </HStack>
    </Card.Root>
  );
}
