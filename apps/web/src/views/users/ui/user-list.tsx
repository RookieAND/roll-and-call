import { cn, Grid } from "@roll-and-call/ui";

import { USERS_DESKTOP_PAGE_SIZE } from "../model/users-desktop-page-size";
import type { UsersListItem } from "../model/users-list-item";
import { UserCard } from "./user-card";
import { UserRow } from "./user-row";

interface UserListProps {
  users: UsersListItem[];
  page: number;
}

// 1100px 기준으로 한쪽만 보인다. 같은 데이터를 행과 카드로 둘 다 그리고 CSS로 가른다.
export function UserList({ users, page }: UserListProps) {
  const desktopCount = page * USERS_DESKTOP_PAGE_SIZE;
  return (
    <>
      <ul className="divide-y divide-gray-200 desktop:hidden">
        {users.map((user) => (
          <li key={user.userId}>
            <UserRow user={user} />
          </li>
        ))}
      </ul>
      <Grid cols={3} gap="150" render={<ul />} className="hidden desktop:grid">
        {users.map((user, index) => (
          <li key={user.userId} className={cn(index >= desktopCount && "hidden")}>
            <UserCard user={user} />
          </li>
        ))}
      </Grid>
    </>
  );
}
