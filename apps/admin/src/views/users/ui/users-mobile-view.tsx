import { VStack } from "@roll-and-call/ui";

import type { UserFilter, UserRow, UserSortColumn } from "@/entities/user";
import { MEMBERSHIP_STATUS, type MembershipStatus, type TableSort } from "@/shared/lib";
import {
  AdminHeader,
  EMPTY_IMAGE,
  EmptyState,
  InfiniteRows,
  ListSortBar,
  UrlSearchInput,
} from "@/shared/ui";

import { USER_SORT_OPTIONS } from "../model/user-sort-options";
import { MembershipTabs } from "./membership-tabs";
import { UserListRow } from "./mobile/user-list-row";
import { UserFilterChips } from "./user-filter-chips";

interface UsersMobileViewProps {
  rows: UserRow[];
  membershipCounts: Record<MembershipStatus, number>;
  sort: TableSort<UserSortColumn>;
  query: Record<string, string | undefined>;
  filter?: UserFilter;
  membership: MembershipStatus;
}

export function UsersMobileView({
  rows,
  membershipCounts,
  sort,
  query,
  filter,
  membership,
}: UsersMobileViewProps) {
  const active = membership === MEMBERSHIP_STATUS.active;
  return (
    <>
      <AdminHeader title="유저" />
      <MembershipTabs value={membership} counts={membershipCounts} />
      <VStack gap="100" className="border-b border-gray-200 bg-surface px-200 py-150">
        <UrlSearchInput placeholder="닉네임 또는 디스코드 ID 검색" className="w-full" />
        {active ? (
          <div className="-mx-200 overflow-x-auto px-200 scrollbar-none">
            <UserFilterChips query={query} filter={filter} />
          </div>
        ) : null}
      </VStack>
      {active ? (
        <ListSortBar total={`${rows.length}명`} sort={sort} options={USER_SORT_OPTIONS} />
      ) : null}
      {rows.length === 0 ? (
        <EmptyState
          image={EMPTY_IMAGE.search}
          title="조건에 맞는 유저가 없습니다"
          description="검색어나 필터를 바꿔 보세요."
        />
      ) : (
        <InfiniteRows
          unit="명"
          rows={rows.map((row) => (
            <UserListRow key={row.id} row={row} />
          ))}
        />
      )}
    </>
  );
}
