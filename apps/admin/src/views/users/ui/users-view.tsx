import { Chip, HStack, Text, VStack } from "@roll-and-call/ui";
import { SearchX } from "lucide-react";
import Link from "next/link";

import { withQuery } from "@/shared/lib";
import { USER_FILTERS, type UserFilter, type UserRow } from "@/shared/server";
import { AdminHeader, EmptyState, Panel, UrlSearchInput } from "@/shared/ui";

import { UsersTable } from "./users-table";

interface UsersViewProps {
  rows: UserRow[];
  query: { q?: string; filter?: UserFilter };
}

export function UsersView({ rows, query }: UsersViewProps) {
  const filterLabel = query.filter ? USER_FILTERS[query.filter] : "전체";
  const filters = Object.entries(USER_FILTERS) as [UserFilter, string][];

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
        <Panel
          title="유저"
          right={
            <Text typography="body4" foreground="hint">
              {filterLabel} · {rows.length}명
            </Text>
          }
          className="flex-1"
        >
          {rows.length > 0 ? (
            <UsersTable rows={rows} />
          ) : (
            <EmptyState icon={SearchX} title="조건에 맞는 유저가 없어요" />
          )}
        </Panel>
      </VStack>
    </>
  );
}
