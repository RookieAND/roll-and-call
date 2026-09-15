import { Button, VStack } from "@trpg/ui";
import Link from "next/link";

import { formatDate } from "@/shared/lib";
import { StatusNotice } from "@/shared/ui";

import { ACTION_SECONDARY_CLASS } from "./action-class-names";

export function ClosedActions({ endDate, expired }: { endDate: Date; expired: boolean }) {
  // "마감"은 기한 경과 한 뜻. 대기를 끈 게임의 정원 충족은 "정원이 차서"라고 쓴다.
  const closedMessage = expired
    ? `${formatDate(endDate)}에 모집이 마감되었습니다`
    : "정원이 차서 신청을 받지 않습니다";

  return (
    <VStack gap={3}>
      <StatusNotice tone="muted">{closedMessage}</StatusNotice>
      <Button asChild variant="outline" className={ACTION_SECONDARY_CLASS}>
        <Link href="/games">비슷한 구인 보기</Link>
      </Button>
    </VStack>
  );
}
