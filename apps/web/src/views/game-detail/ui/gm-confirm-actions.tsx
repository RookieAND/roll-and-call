import { Button, VStack } from "@trpg/ui";
import Link from "next/link";

import { StatusNotice } from "@/shared/ui";

import { ACTION_PRIMARY_CLASS } from "./action-class-names";

export function GmConfirmActions({ gameId }: { gameId: string }) {
  return (
    <VStack gap={3}>
      <StatusNotice tone="muted">
        모집 기한이 지났습니다. 지금 명단으로 세션 시간을 확정하세요.
      </StatusNotice>
      <Button asChild className={ACTION_PRIMARY_CLASS}>
        <Link href={`/games/${gameId}/schedule`}>세션 시간 확정하기</Link>
      </Button>
    </VStack>
  );
}
