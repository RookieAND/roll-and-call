import { Button } from "@roll-and-call/ui";

import { EmptyState, ServerLink } from "@/shared/ui";

import type { UsersFilter } from "../model/users-filter";
import { usersHref } from "../model/users-href";

interface UsersEmptyProps {
  filter: UsersFilter;
}

export function UsersEmpty({ filter }: UsersEmptyProps) {
  if (filter.q) {
    return (
      <EmptyState
        image="empty-search"
        title="찾는 유저가 없습니다"
        description="닉네임을 다시 확인하거나 검색어를 지워 볼 수 있습니다."
        action={
          <Button
            variant="outline"
            render={<ServerLink path={usersHref({ ...filter, q: undefined })} />}
          >
            검색어 지우기
          </Button>
        }
      />
    );
  }
  return (
    <EmptyState
      image="empty-rulebook-search"
      title="조건에 맞는 유저가 없습니다"
      description="조건을 줄여 볼 수 있습니다."
      action={
        <Button
          variant="outline"
          render={
            <ServerLink
              path={usersHref({ ...filter, cert: undefined, host: undefined, recruiting: false })}
            />
          }
        >
          필터 초기화
        </Button>
      }
    />
  );
}
