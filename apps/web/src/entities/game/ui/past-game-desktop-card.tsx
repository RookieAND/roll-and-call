import { Badge, Card, HStack, Text, VStack } from "@roll-and-call/ui";

import type { PastGameCardView } from "../model/past-game-card-view";
import { GameStatusBadge } from "./game-status-badge";
import { GameThumbnail } from "./game-thumbnail";
import { PrivateMark } from "./private-mark";

interface PastGameDesktopCardProps {
  title: string;
  view: PastGameCardView;
}

// 1100px 이상의 지난 구인 카드: 진행 중 카드와 같은 모양(위 16:9 썸네일, 아래 배지·제목·메타). 스포일러 썸네일은 회색 칸이다.
export function PastGameDesktopCard({ title, view }: PastGameDesktopCardProps) {
  return (
    <Card.Root
      interactive
      padding="none"
      className="hidden h-full flex-col overflow-hidden rounded-600 desktop:flex"
    >
      {view.thumbnailUrl ? (
        <GameThumbnail
          url={view.thumbnailUrl}
          sizes="412px"
          className="aspect-video w-full flex-none grayscale"
        />
      ) : (
        <span className="aspect-video w-full flex-none bg-gray-100" />
      )}
      <VStack gap="100" className="flex-1 px-175 pt-175 pb-200">
        <div className="flex">
          {view.grayBadge ? (
            <Badge colorPalette="gray">{view.grayBadge}</Badge>
          ) : (
            <GameStatusBadge status={view.status} />
          )}
        </div>
        <Text typography="heading3" foreground="muted" className="flex-1 text-pretty">
          {title}
        </Text>
        <HStack align="center" gap="100" className="flex-wrap">
          <Text typography="body3" foreground="muted">
            {view.meta}
          </Text>
          {view.isPrivate && <PrivateMark />}
        </HStack>
      </VStack>
    </Card.Root>
  );
}
