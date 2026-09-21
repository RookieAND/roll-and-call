import { Check } from "lucide-react";

import { formatDateTime } from "@/shared/lib";

import { ActionNotice } from "./action-notice";

interface ConfirmedActionsProps {
  confirmedAt: Date;
}

// 세션 시간이 잡힌 뒤엔 조율이 끝났다. 읽는 정보이고, 누를 것이 아니다.
export function ConfirmedActions({ confirmedAt }: ConfirmedActionsProps) {
  return (
    <ActionNotice
      title={`${formatDateTime(confirmedAt)}으로 확정됐습니다`}
      tone="success"
      icon={Check}
    >
      시작 1시간 전 디스코드로 알립니다.
      <br />
      세션 시간에 늦지 않게 참여해 주세요.
    </ActionNotice>
  );
}
