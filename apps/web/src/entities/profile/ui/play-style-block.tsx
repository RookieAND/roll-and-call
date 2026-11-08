import { Card, Text, VStack } from "@roll-and-call/ui";
import { PencilLine } from "lucide-react";

interface PlayStyleBlockProps {
  playStyle: string | null | undefined;
  // 마이페이지만 비었을 때 안내를 보인다. 타인 프로필은 비면 블록을 그리지 않는다.
  showEmpty?: boolean;
}

export function PlayStyleBlock({ playStyle, showEmpty = false }: PlayStyleBlockProps) {
  if (!playStyle && !showEmpty) return null;
  return (
    <VStack gap="100" render={<section />}>
      <Text typography="body4" weight="bold" foreground="muted" render={<h3 />}>
        플레이 스타일
      </Text>
      {playStyle ? (
        <Card.Root padding="none" radius={600} className="p-175">
          <Text
            typography="body2"
            foreground="inherit"
            render={<p />}
            className="block text-pretty whitespace-pre-line"
          >
            {playStyle}
          </Text>
        </Card.Root>
      ) : (
        <Card.Root
          padding="none"
          radius={400}
          className="flex min-h-11 items-center gap-100 border-dashed border-gray-300 px-150 text-hint"
        >
          <PencilLine size={15} aria-hidden className="flex-none" />
          <Text typography="body4" foreground="inherit" className="flex-1">
            적어둔 플레이 스타일이 없습니다
          </Text>
        </Card.Root>
      )}
    </VStack>
  );
}
