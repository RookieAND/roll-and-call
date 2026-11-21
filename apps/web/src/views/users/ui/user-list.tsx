import { cn, Grid } from "@roll-and-call/ui";

import { USERS_DESKTOP_PAGE_SIZE } from "../model/users-desktop-page-size";
import type { UsersListItem } from "../model/users-list-item";
import { UserCard } from "./user-card";
import { UserCompactCard } from "./user-compact-card";

interface UserListProps {
  users: UsersListItem[];
  page: number;
}

// 모바일은 납작한 카드 1열, 데스크톱은 3열 카드. 데스크톱은 3열이 줄 끝까지 차도록 쪽마다 9장만 보인다.
export function UserList({ users, page }: UserListProps) {
  const desktopCount = page * USERS_DESKTOP_PAGE_SIZE;
  return (
    <Grid cols={1} gap="100" render={<ul />} className="desktop:grid-cols-3 desktop:gap-150">
      {users.map((user, index) => (
        <li key={user.userId} className={cn(index >= desktopCount && "desktop:hidden")}>
          <div className="desktop:hidden">
            <UserCompactCard user={user} />
          </div>
          <div className="hidden h-full desktop:block">
            <UserCard user={user} />
          </div>
        </li>
      ))}
    </Grid>
  );
}
