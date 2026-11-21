import { HStack, Text } from "@roll-and-call/ui";

import type { UsersFilter } from "../model/users-filter";
import { UsersSortSheet } from "./users-sort-sheet";

interface UsersCountRowProps {
  filter: UsersFilter;
  total: number;
}

export function UsersCountRow({ filter, total }: UsersCountRowProps) {
  const label = filter.q ? `검색 결과 ${total}명` : `유저 ${total}명`;
  return (
    <HStack align="center" justify="between" gap="100">
      <Text typography="subtitle2" numeric>
        {label}
      </Text>
      <UsersSortSheet filter={filter} />
    </HStack>
  );
}
