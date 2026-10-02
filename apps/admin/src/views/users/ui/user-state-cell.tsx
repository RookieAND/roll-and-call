import { Text } from "@roll-and-call/ui";

import { MEMBERSHIP_LABEL, MEMBERSHIP_STATUS } from "@/shared/lib";
import type { UserRow } from "@/shared/server";
import { Tag } from "@/shared/ui";

interface UserStateCellProps {
  row: UserRow;
}

// 정상은 뱃지 없이 흐린 글자로 두고, 제재 중·차단됨·탈퇴만 뱃지로 보인다.
export function UserStateCell({ row }: UserStateCellProps) {
  if (row.membership !== MEMBERSHIP_STATUS.active)
    return <Tag>{MEMBERSHIP_LABEL[row.membership]}</Tag>;
  if (row.sanctioned) return <Tag>제재 중</Tag>;
  return (
    <Text typography="body3" foreground="hint">
      정상
    </Text>
  );
}
