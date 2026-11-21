import { Button, cn } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

import type { UsersFilter } from "../model/users-filter";
import { usersHref } from "../model/users-href";

interface UsersMoreButtonProps {
  filter: UsersFilter;
  page: number;
  mobile: boolean;
  desktop: boolean;
}

// 모바일과 데스크톱은 한 쪽 분량이 달라 남은 사람이 있는지도 따로 본다.
export function UsersMoreButton({ filter, page, mobile, desktop }: UsersMoreButtonProps) {
  if (!mobile && !desktop) return null;
  return (
    <Button
      variant="outline"
      className={cn(
        "w-full",
        !mobile && "hidden desktop:inline-flex",
        !desktop && "desktop:hidden",
      )}
      render={<ServerLink path={usersHref(filter, page + 1)} scroll={false} />}
    >
      더 보기
    </Button>
  );
}
