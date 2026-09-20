import { Button, VStack } from "@trpg/ui";
import Link from "next/link";

import { formatDate } from "@/shared/lib";
import { StatusNotice } from "@/shared/ui";

import { ACTION_SECONDARY_CLASS } from "./action-class-names";
import { ActionHint } from "./action-hint";

export function ClosedActions({ endDate, expired }: { endDate: Date; expired: boolean }) {
  // "마감"은 기한 경과 한 뜻. 대기를 끈 게임의 정원 충족은 "정원이 차서"라고 쓴다.
  // 기한이 지난 건 막다른 길이라 카드로 세우지 않고 버튼 위에 한 줄만 써붙인다.
  return (
    <VStack gap={expired ? "100" : "150"}>
      {expired ? (
        <ActionHint>{formatDate(endDate)}에 모집이 마감되었습니다.</ActionHint>
      ) : (
        <StatusNotice tone="muted">정원이 차서 신청을 받지 않습니다</StatusNotice>
      )}
      <Button asChild variant="outline" className={ACTION_SECONDARY_CLASS}>
        <Link href="/games">비슷한 구인 보기</Link>
      </Button>
    </VStack>
  );
}
