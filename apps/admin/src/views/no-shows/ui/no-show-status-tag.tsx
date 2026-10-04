import { Badge } from "@roll-and-call/ui";

import { NO_SHOW_STATUS, NO_SHOW_STATUS_LABEL, type NoShowStatus } from "@/shared/server";
import { Tag } from "@/shared/ui";

interface NoShowStatusTagProps {
  status: NoShowStatus;
}

// 빨강은 쓰지 않는다(D189는 「최근 30일 2회 이상」 숫자에만). 기간 지남은 회색 테두리.
export function NoShowStatusTag({ status }: NoShowStatusTagProps) {
  const label = NO_SHOW_STATUS_LABEL[status];
  if (status === NO_SHOW_STATUS.expired) {
    return <Badge className="border border-gray-200 bg-transparent">{label}</Badge>;
  }
  return <Tag>{label}</Tag>;
}
