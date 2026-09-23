import { VStack } from "@roll-and-call/ui";

import { ActionNotice } from "./action-notice";
import { SimilarGamesLink } from "./similar-games-link";

interface ClosedActionsProps {
  title?: string;
}

// 막다른 길에는 다음 행동을 붙인다. 신청하지 않은 사람에게 결과 페이지는 열지 않는다.
export function ClosedActions({ title = "모집이 끝났습니다" }: ClosedActionsProps) {
  return (
    <VStack gap="125">
      <ActionNotice title={title} colorPalette="gray">
        비슷한 조건의 다른 구인글을 찾아보세요.
      </ActionNotice>
      <SimilarGamesLink size="lg" className="w-full" />
    </VStack>
  );
}
