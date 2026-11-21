import { Badge, HStack } from "@roll-and-call/ui";
import { Megaphone } from "lucide-react";

import { ProfileRow } from "@/entities/profile";
import { ServerLink } from "@/shared/ui";

import { EMPTY_BIO } from "../model/empty-bio";
import type { UsersListItem } from "../model/users-list-item";
import { UserTitleBadge } from "./user-title-badge";

interface UserRowProps {
  user: UsersListItem;
}

export function UserRow({ user }: UserRowProps) {
  return (
    <HStack
      align="center"
      gap="100"
      render={<ServerLink path={`/users/${user.userId}`} />}
      className="min-h-16 py-125"
    >
      <ProfileRow
        name={user.username}
        avatarUrl={user.avatarUrl}
        nameAddon={user.title && <UserTitleBadge title={user.title} />}
        subline={user.bio || EMPTY_BIO}
        sublineForeground={user.bio ? "muted" : "hint"}
      />
      {user.recruitingCount > 0 && (
        <Badge
          colorPalette="primary"
          aria-label={`모집 중 ${user.recruitingCount}건`}
          className="gap-050"
        >
          <Megaphone size={14} aria-hidden />
          {user.recruitingCount}
        </Badge>
      )}
    </HStack>
  );
}
