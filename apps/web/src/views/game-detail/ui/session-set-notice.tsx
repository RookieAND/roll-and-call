import { CircleAlert } from "lucide-react";

import { ActionNotice } from "./action-notice";

// 기한이 남았어도 시간이 정해지면 새 신청을 받지 않는다. 막다른 길이라 다음 행동을 권한다.
export function SessionSetNotice() {
  return (
    <ActionNotice title="세션 시간이 정해져 신청을 받지 않습니다" tone="danger" icon={CircleAlert}>
      비슷한 조건의 다른 구인글을 찾아보세요.
    </ActionNotice>
  );
}
