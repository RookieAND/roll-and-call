import { Chip, HStack, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { paginate, withQuery } from "@/shared/lib";
import { USER_FILTERS, type UserFilter, type UserRow } from "@/shared/server";
import { AdminHeader, ListPager, Panel, UrlSearchInput } from "@/shared/ui";

import { UsersTable } from "./users-table";

interface UsersViewProps {
  rows: UserRow[];
  page?: string;
  query: { q?: string; filter?: UserFilter };
}

export function UsersView({ rows, page, query }: UsersViewProps) {
  const filters = Object.entries(USER_FILTERS) as [UserFilter, string][];
  const paged = paginate(rows, page);
  const pager = (
    <ListPager page={paged.page} totalPages={paged.totalPages} total={rows.length} unit="명" />
  );

  return (
    <>
      <AdminHeader title="유저" sub={`${rows.length}명`} />
      <VStack gap="150" className="flex-1 p-200">
        <HStack align="center" gap="125">
          <UrlSearchInput placeholder="디스코드 닉네임 검색" className="w-[280px]" />
          {filters.map(([key, label]) => {
            const selected = query.filter === key;
            return (
              <Chip
                key={key}
                selected={selected}
                render={
                  <Link
                    href={withQuery("/users", query, { filter: selected ? undefined : key })}
                    scroll={false}
                  />
                }
              >
                {label}
              </Chip>
            );
          })}
        </HStack>
        <Panel footer={pager}>
          <UsersTable rows={paged.rows} />
        </Panel>
      </VStack>
    </>
  );
}
