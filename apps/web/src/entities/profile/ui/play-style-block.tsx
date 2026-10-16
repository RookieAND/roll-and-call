import { HStack, Text, VStack } from "@roll-and-call/ui";
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
        <Text
          typography="body2"
          render={<p />}
          className="rounded-600 border border-gray-200 bg-gray-50 p-175 leading-[1.7] text-pretty whitespace-pre-line"
        >
          {playStyle}
        </Text>
      ) : (
        <HStack
          align="center"
          gap="100"
          className="min-h-11 rounded-400 border border-dashed border-gray-300 px-150 text-hint"
        >
          <PencilLine size={15} aria-hidden className="flex-none" />
          <Text typography="body4" foreground="hint">
            적어둔 플레이 스타일이 없습니다
          </Text>
        </HStack>
      )}
    </VStack>
  );
}
