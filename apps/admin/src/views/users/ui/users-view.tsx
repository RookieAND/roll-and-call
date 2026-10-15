import { HStack, VStack } from "@roll-and-call/ui";

import type { UserFilter, UserRow, UserSortColumn } from "@/entities/user";
import {
  MEMBERSHIP_STATUS,
  paginate,
  parsePageSize,
  type MembershipStatus,
  type TableSort,
} from "@/shared/lib";
import { AdminHeader, ListPager, Panel, UrlSearchInput } from "@/shared/ui";

import { MembershipTabs } from "./membership-tabs";
import { UserFilterChips } from "./user-filter-chips";
import { UsersTable } from "./users-table";

interface UsersViewProps {
  rows: UserRow[];
  membershipCounts: Record<MembershipStatus, number>;
  sort: TableSort<UserSortColumn>;
  page?: string;
  query: Record<string, string | undefined>;
  filter?: UserFilter;
  membership: MembershipStatus;
}

export function UsersView({
  rows,
  membershipCounts,
  sort,
  page,
  query,
  filter,
  membership,
}: UsersViewProps) {
  const pageSize = parsePageSize(query.pageSize);
  const paged = paginate(rows, page, pageSize);
  const active = membership === MEMBERSHIP_STATUS.active;
  const pager = (
    <ListPager
      page={paged.page}
      totalPages={paged.totalPages}
      total={rows.length}
      unit="명"
      pageSize={pageSize}
    />
  );

  return (
    <>
      <AdminHeader title="유저" />
      <MembershipTabs value={membership} counts={membershipCounts} />
      <VStack gap="150" className="flex-1 p-200">
        <HStack align="center" gap="125">
          <UrlSearchInput
            placeholder="닉네임 또는 디스코드 ID 검색"
            className="w-[240px] shrink-0"
          />
          <UserFilterChips query={query} filter={filter} />
        </HStack>
        <Panel footer={pager} className="flex-none">
          <UsersTable rows={paged.rows} sort={sort} showState={active} />
        </Panel>
      </VStack>
    </>
  );
}
