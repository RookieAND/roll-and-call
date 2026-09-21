import { Button, HStack, Text, VStack } from "@trpg/ui";
import { CircleAlert } from "lucide-react";
import Link from "next/link";

interface SeatsFullNoticeProps {
  gameId: string;
  onClose: () => void;
}

// 검색은 되지만 아무도 고를 수 없다. 자리를 비우거나 정원을 늘리는 두 길을 나란히 둔다.
export function SeatsFullNotice({ gameId, onClose }: SeatsFullNoticeProps) {
  return (
    <HStack align="start" gap="125" className="mx-250 rounded-500 bg-notice-bg px-175 py-150">
      <CircleAlert size={16} aria-hidden className="mt-025 shrink-0 text-notice-ink" />
      <VStack gap="125" className="flex-1">
        <Text typography="body4" render={<p />} className="text-notice-ink">
          남은 자리가 없습니다.
          <br />
          한 명을 내보내야 새로 넣을 수 있습니다.
        </Text>
        <HStack gap="100">
          <Button
            className="h-[34px] flex-1 rounded-400 bg-warning-600 text-body4 font-bold text-white hover:bg-warning-600/90"
            onClick={onClose}
          >
            참여자 관리 열기
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-[34px] flex-1 rounded-400 border-notice-border text-body4 font-bold text-notice-ink"
          >
            <Link href={`/games/${gameId}/edit`}>정원 늘리기</Link>
          </Button>
        </HStack>
      </VStack>
    </HStack>
  );
}
