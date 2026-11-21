import { Avatar, Card, Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { Book, Flag, Megaphone, Users } from "lucide-react";

import { BannerImage, ServerLink } from "@/shared/ui";

import { EMPTY_BIO } from "../model/empty-bio";
import type { UsersListItem } from "../model/users-list-item";
import { UserStatCell } from "./user-stat-cell";
import { UserTitleBadge } from "./user-title-badge";

interface UserCardProps {
  user: UsersListItem;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <Card.Root
      padding="none"
      interactive
      render={<ServerLink path={`/users/${user.userId}`} />}
      className="block h-full overflow-hidden"
    >
      <div className="relative aspect-[3/1] w-full overflow-hidden bg-primary-100">
        {user.bannerUrl && <BannerImage src={user.bannerUrl} />}
      </div>
      <VStack gap="125" className="px-200 pb-200">
        <span className="relative -mt-9 flex w-fit rounded-full bg-surface p-050">
          <Avatar src={user.avatarUrl} name={user.username} size="2xl" />
        </span>
        <VStack gap="050" className="min-w-0">
          <HStack align="center" gap="075" className="min-w-0">
            <Text truncate typography="subtitle1">
              {user.username}
            </Text>
            {user.title && <UserTitleBadge title={user.title} />}
          </HStack>
          <Text
            typography="body4"
            foreground={user.bio ? "muted" : "hint"}
            className="line-clamp-2 min-h-[2lh]"
          >
            {user.bio || EMPTY_BIO}
          </Text>
        </VStack>
        <Grid cols={2} gap="075">
          <UserStatCell
            icon={Megaphone}
            value={user.recruitingCount}
            label="모집 중"
            tinted={user.recruitingCount > 0}
          />
          <UserStatCell icon={Book} value={user.certifiedRulebookCount} label="인증 룰북" />
          <UserStatCell icon={Flag} value={user.hostedCount} label="운영한 세션" />
          <UserStatCell icon={Users} value={user.playedCount} label="참여한 세션" />
        </Grid>
      </VStack>
    </Card.Root>
  );
}
