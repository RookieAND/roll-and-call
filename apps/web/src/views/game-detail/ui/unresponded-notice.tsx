import { CircleAlert } from "lucide-react";

import { ActionNotice } from "./action-notice";

export function UnrespondedNotice() {
  return (
    <ActionNotice title="아직 가능 시간을 내지 않았습니다" tone="warning" icon={CircleAlert}>
      일정 조율 페이지에서 참여 가능한 시간을 제출해주세요.
    </ActionNotice>
  );
}
