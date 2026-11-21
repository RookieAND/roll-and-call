import { Container, HStack, VStack } from "@roll-and-call/ui";

import { AppBar, PageShell } from "@/shared/ui";

import { loadRuleOptions } from "../api/load-rule-options";
import { loadUsersPage } from "../api/load-users-page";
import type { UsersFilter } from "../model/users-filter";
import { UserList } from "./user-list";
import { UsersCountRow } from "./users-count-row";
import { UsersEmpty } from "./users-empty";
import { UsersFilterSheet } from "./users-filter-sheet";
import { UsersMoreButton } from "./users-more-button";
import { UsersSearchForm } from "./users-search-form";

interface UsersViewProps {
  filter: UsersFilter;
  page: number;
}

export async function UsersView({ filter, page }: UsersViewProps) {
  const [{ rows, total }, ruleOptions] = await Promise.all([
    loadUsersPage({ filter, page }),
    loadRuleOptions(),
  ]);
  return (
    <PageShell appBar={<AppBar title="유저" />}>
      <Container size="sm" className="py-150 desktop:max-w-none">
        <VStack gap="150">
          <HStack align="center" gap="050">
            <UsersSearchForm filter={filter} />
            <UsersFilterSheet filter={filter} total={total} ruleOptions={ruleOptions} />
          </HStack>
          <UsersCountRow filter={filter} total={total} />
          {rows.length === 0 ? <UsersEmpty filter={filter} /> : <UserList users={rows} />}
          {rows.length > 0 && rows.length < total && (
            <UsersMoreButton filter={filter} page={page} />
          )}
        </VStack>
      </Container>
    </PageShell>
  );
}
