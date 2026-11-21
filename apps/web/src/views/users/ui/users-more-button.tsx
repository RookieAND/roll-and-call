import { Button } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

import type { UsersFilter } from "../model/users-filter";
import { usersHref } from "../model/users-href";

interface UsersMoreButtonProps {
  filter: UsersFilter;
  page: number;
}

export function UsersMoreButton({ filter, page }: UsersMoreButtonProps) {
  return (
    <Button
      variant="outline"
      className="w-full"
      render={<ServerLink path={usersHref(filter, page + 1)} scroll={false} />}
    >
      더 보기
    </Button>
  );
}
