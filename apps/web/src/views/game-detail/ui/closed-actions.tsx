import { VStack } from "@trpg/ui";
import { LockKeyhole } from "lucide-react";

import { ACTION_PRIMARY_CLASS } from "./action-class-names";
import { ActionNotice } from "./action-notice";
import { SimilarGamesLink } from "./similar-games-link";

// 막다른 길에는 다음 행동을 붙인다. 신청하지 않은 사람에게 결과 페이지는 열지 않는다.
export function ClosedActions() {
  return (
    <VStack gap="125">
      <ActionNotice title="모집이 끝났습니다" icon={LockKeyhole}>
        비슷한 조건의 다른 구인글을 찾아보세요.
      </ActionNotice>
      <SimilarGamesLink className={ACTION_PRIMARY_CLASS} />
    </VStack>
  );
}
