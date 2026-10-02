import { Chip, HStack, VStack } from "@roll-and-call/ui";

import {
  MEMBERSHIP_LABEL,
  MEMBERSHIP_STATUS,
  paginate,
  withQuery,
  type MembershipStatus,
} from "@/shared/lib";
import { USER_FILTERS, type UserFilter, type UserRow } from "@/shared/server";
import { AdminHeader, ListPager, Panel, ServerLink, UrlSearchInput } from "@/shared/ui";

import { MembershipSegment } from "./membership-segment";
import { UsersTable } from "./users-table";

interface UsersViewProps {
  rows: UserRow[];
  page?: string;
  query: { q?: string; filter?: UserFilter; membership?: MembershipStatus };
}

export function UsersView({ rows, page, query }: UsersViewProps) {
  const filters = Object.entries(USER_FILTERS) as [UserFilter, string][];
  const membership = query.membership ?? MEMBERSHIP_STATUS.active;
  const paged = paginate(rows, page);
  const count = `${rows.length}명`;
  const sub =
    membership === MEMBERSHIP_STATUS.active ? count : `${MEMBERSHIP_LABEL[membership]} ${count}`;
  const pager = (
    <ListPager page={paged.page} totalPages={paged.totalPages} total={rows.length} unit="명" />
  );

  return (
    <>
      <AdminHeader title="유저" sub={sub} />
      <VStack gap="150" className="flex-1 p-200">
        <HStack align="center" gap="125">
          <MembershipSegment value={membership} />
          <UrlSearchInput placeholder="디스코드 닉네임 검색" className="w-[240px] shrink-0" />
          <HStack gap="075" wrap>
            {filters.map(([key, label]) => {
              const selected = query.filter === key;
              return (
                <Chip
                  key={key}
                  selected={selected}
                  render={
                    <ServerLink
                      path={withQuery("/users", query, { filter: selected ? undefined : key })}
                      scroll={false}
                    />
                  }
                >
                  {label}
                </Chip>
              );
            })}
          </HStack>
        </HStack>
        <Panel footer={pager} className="flex-none">
          <UsersTable rows={paged.rows} />
        </Panel>
      </VStack>
    </>
  );
}
