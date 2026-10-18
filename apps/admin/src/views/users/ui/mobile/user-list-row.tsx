import { Text } from "@roll-and-call/ui";

import type { UserRow } from "@/entities/user";
import { formatFullDate, MEMBERSHIP_LABEL, MEMBERSHIP_STATUS, withoutYear } from "@/shared/lib";
import { ListRow, Tag } from "@/shared/ui";

const NO_SHOW_WARNING_COUNT = 2;

const LEFT_DESCRIPTION = {
  [MEMBERSHIP_STATUS.left]: "서버에서 나갔습니다",
  [MEMBERSHIP_STATUS.banned]: "롤앤콜과 디스코드에서 모두 차단했습니다",
} as const;

interface UserListRowProps {
  row: UserRow;
}

export function UserListRow({ row }: UserListRowProps) {
  const path = `/users/${row.id}`;
  if (row.membership !== MEMBERSHIP_STATUS.active) {
    return (
      <ListRow
        path={path}
        title={row.nickname}
        badges={<Tag>{MEMBERSHIP_LABEL[row.membership]}</Tag>}
        description={LEFT_DESCRIPTION[row.membership]}
      />
    );
  }
  const frequentNoShow = row.recentNoShowCount >= NO_SHOW_WARNING_COUNT;
  const sanctionMeta =
    row.sanctioned && row.sanctionUntil
      ? `${withoutYear(formatFullDate(row.sanctionUntil))}까지 제재`
      : null;
  return (
    <ListRow
      path={path}
      title={row.nickname}
      badges={
        row.isNew || row.sanctioned ? (
          <>
            {row.isNew ? <Tag>신규</Tag> : null}
            {row.sanctioned ? <Tag>제재 중</Tag> : null}
          </>
        ) : null
      }
      trailing={
        <Text
          typography="body3"
          weight={frequentNoShow ? "bold" : undefined}
          foreground={frequentNoShow ? "danger" : "hint"}
        >
          불참 {row.recentNoShowCount}회
        </Text>
      }
      description={`참여 ${row.playedCount}회 · 연 세션 ${row.hostedCount}회`}
      meta={sanctionMeta}
    />
  );
}
