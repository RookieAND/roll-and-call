import { VStack } from "@roll-and-call/ui";

import { formatDateWeekday } from "@/shared/lib";

import { ActionNotice } from "./action-notice";
import { SimilarGamesLink } from "./similar-games-link";

interface EndedActionsProps {
  confirmedAt: Date;
}

// 끝난 세션에서 할 일은 다음 세션을 찾는 것뿐이다.
export function EndedActions({ confirmedAt }: EndedActionsProps) {
  return (
    <VStack gap="125">
      <ActionNotice
        title={`${formatDateWeekday(confirmedAt)}에 세션이 끝났습니다`}
        colorPalette="gray"
      >
        출석은 GM이 확인한 뒤 마이페이지 기록에 남습니다.
      </ActionNotice>
      <SimilarGamesLink size="lg" className="w-full" />
    </VStack>
  );
}
