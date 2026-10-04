import { Badge } from "@roll-and-call/ui";

import { Tag } from "@/shared/ui";

interface NoShowStateTagProps {
  cancelled: boolean;
  expired: boolean;
}

// 30일 밖의 유효 기록은 회색 테두리 뱃지다. Tag에는 테두리 모양이 없어 Badge에 테두리만 더한다.
export function NoShowStateTag({ cancelled, expired }: NoShowStateTagProps) {
  if (cancelled) return <Tag>취소됨</Tag>;
  if (expired) {
    return (
      <Badge colorPalette="gray" className="border border-gray-300 bg-transparent">
        기간 지남
      </Badge>
    );
  }
  return <Tag>유효</Tag>;
}
