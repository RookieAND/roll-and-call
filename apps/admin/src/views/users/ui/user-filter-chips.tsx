import { Chip, HStack, Tooltip } from "@roll-and-call/ui";

import { withQuery } from "@/shared/lib";
import { USER_FILTER_HINT, USER_FILTERS, type UserFilter } from "@/shared/server";
import { ServerLink } from "@/shared/ui";

const FILTERS = Object.entries(USER_FILTERS) as [UserFilter, string][];

interface UserFilterChipsProps {
  query: Record<string, string | undefined>;
  filter?: UserFilter;
  disabled?: boolean;
}

// 한 번에 하나만 켜고, 켠 칩을 다시 누르면 끈다. 정렬과 검색어는 남긴다.
export function UserFilterChips({ query, filter, disabled }: UserFilterChipsProps) {
  return (
    <HStack gap="075" className="shrink-0">
      {FILTERS.map(([key, label]) => {
        const selected = filter === key;
        const hint = USER_FILTER_HINT[key];
        const chip = disabled ? (
          <Chip key={key} disabled>
            {label}
          </Chip>
        ) : (
          <Chip
            key={key}
            selected={selected}
            render={
              <ServerLink
                path={withQuery("/users", query, {
                  filter: selected ? undefined : key,
                  page: undefined,
                })}
                scroll={false}
              />
            }
          >
            {label}
          </Chip>
        );
        return hint ? (
          <Tooltip key={key} content={hint}>
            {chip}
          </Tooltip>
        ) : (
          chip
        );
      })}
    </HStack>
  );
}
