import { Avatar, Card, Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { CalendarClock, Flag, Megaphone, Users } from "lucide-react";

import { KeywordChips } from "@/entities/profile";
import { MemberTitle } from "@/features/view-badge";
import { BannerImage, ServerLink } from "@/shared/ui";

import { EMPTY_BIO } from "../model/empty-bio";
import { KEYWORD_LIMIT } from "../model/keyword-limit";
import type { UsersListItem } from "../model/users-list-item";
import { UserMonthMedals } from "./user-month-medals";
import { UserStatCell } from "./user-stat-cell";

interface UserCardProps {
  user: UsersListItem;
}

// 닉네임·성향·소개 자리를 고정해 모든 카드에서 같은 위치에 두고, 수치 칸은 맨 아래에 붙인다. 성향이 없으면 점선 칩으로 비었다고 보인다.
export function UserCard({ user }: UserCardProps) {
  return (
    <Card.Root
      padding="none"
      interactive
      render={<ServerLink path={`/users/${user.userId}`} />}
      className="flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[3/1] w-full overflow-hidden bg-primary-100">
        {user.bannerUrl && <BannerImage src={user.bannerUrl} />}
      </div>
      <VStack gap="125" className="flex-1 px-200 pb-200">
        <span className="relative -mt-9 flex w-fit rounded-full bg-surface p-050">
          <Avatar src={user.avatarUrl} name={user.username} size="2xl" />
        </span>
        <VStack gap="100" className="min-w-0">
          <HStack align="center" gap="100" className="h-7 min-w-0">
            <Text truncate typography="heading3">
              {user.username}
            </Text>
            <MemberTitle userId={user.userId} size="sm" />
            <UserMonthMedals medals={user.medals} size="sm" />
          </HStack>
          <KeywordChips
            keywords={user.keywords.slice(0, KEYWORD_LIMIT)}
            size="md"
            className="h-7 min-w-0 overflow-hidden"
          />
          <Text
            typography="body4"
            foreground={user.bio ? "muted" : "hint"}
            className="line-clamp-2 h-[2lh]"
          >
            {user.bio || EMPTY_BIO}
          </Text>
        </VStack>
        <Grid cols={2} gap="075" className="mt-auto">
          <UserStatCell
            icon={Megaphone}
            value={user.recruitingCount}
            label="모집 중인 세션"
            tinted={user.recruitingCount > 0}
          />
          <UserStatCell
            icon={CalendarClock}
            value={user.upcomingCount}
            label="참여 예정 세션"
            tinted={user.upcomingCount > 0}
          />
          <UserStatCell icon={Flag} value={user.hostedCount} label="운영한 세션" />
          <UserStatCell icon={Users} value={user.playedCount} label="참여한 세션" />
        </Grid>
      </VStack>
    </Card.Root>
  );
}
