import { Callout, FloatingBar, Text, VStack } from "@roll-and-call/ui";

import { BackToGameBar } from "./back-to-game-bar";

interface EmptyDrawProps {
  gameId: string;
  title: string;
}

// 신청자 없이 마감된 추첨 글. 보드 12에 아트보드가 없어 결과 화면의 머리와 하단 바 모양을 쓴다.
export function EmptyDraw({ gameId, title }: EmptyDrawProps) {
  return (
    <FloatingBar.Root elevated={false}>
      <VStack gap="150">
        <Text typography="heading3" weight="extrabold" truncate render={<h2 />}>
          {title}
        </Text>
        <Callout.Root colorPalette="gray">
          <Callout.Icon />
          <Callout.Title>신청자 없이 모집이 끝났습니다</Callout.Title>
        </Callout.Root>
      </VStack>
      <BackToGameBar gameId={gameId} />
    </FloatingBar.Root>
  );
}
