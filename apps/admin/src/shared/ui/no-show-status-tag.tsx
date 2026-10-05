import { Badge } from "@roll-and-call/ui";

import { NO_SHOW_STATUS, NO_SHOW_STATUS_LABEL, type NoShowStatus } from "@/shared/lib";

import { Tag } from "./tag";

interface NoShowStatusTagProps {
  status: NoShowStatus;
}

// 빨강은 쓰지 않는다(D189는 「최근 30일 2회 이상」 숫자에만). 30일 밖의 유효 기록은 회색 테두리 뱃지다. Tag에는 테두리 모양이 없어 Badge에 테두리만 더한다.
export function NoShowStatusTag({ status }: NoShowStatusTagProps) {
  const label = NO_SHOW_STATUS_LABEL[status];
  if (status === NO_SHOW_STATUS.expired) {
    return (
      <Badge colorPalette="gray" className="border border-gray-300 bg-transparent">
        {label}
      </Badge>
    );
  }
  return <Tag>{label}</Tag>;
}
