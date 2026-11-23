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

interface UserCompactCardProps {
  user: UsersListItem;
}

// 모바일 카드. 배너·아바타는 데스크톱과 같은 비율로 두고, 소개는 두 줄까지 보이고, 수치는 데스크톱과 같은 칸을 한 단계 작게 쓴다.
export function UserCompactCard({ user }: UserCompactCardProps) {
  const bioForeground = user.bio ? "muted" : "hint";
  return (
    <Card.Root
      padding="none"
      interactive
      render={<ServerLink path={`/users/${user.userId}`} />}
      className="block overflow-hidden"
    >
      <div className="relative aspect-[3/1] w-full overflow-hidden bg-primary-100">
        {user.bannerUrl && <BannerImage src={user.bannerUrl} />}
      </div>
      <VStack gap="100" className="px-150 pb-150">
        <span className="relative -mt-9 flex w-fit rounded-full bg-surface p-050">
          <Avatar src={user.avatarUrl} name={user.username} size="2xl" />
        </span>
        <HStack align="center" gap="075" className="min-w-0">
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
        <Text typography="body4" foreground={bioForeground} className="line-clamp-2">
          {user.bio || EMPTY_BIO}
        </Text>
        <Grid cols={2} gap="075">
          <UserStatCell
            size="sm"
            icon={Megaphone}
            value={user.recruitingCount}
            label="모집 중인 세션"
            tinted={user.recruitingCount > 0}
          />
          <UserStatCell
            size="sm"
            icon={CalendarClock}
            value={user.upcomingCount}
            label="참여 예정 세션"
            tinted={user.upcomingCount > 0}
          />
          <UserStatCell size="sm" icon={Flag} value={user.hostedCount} label="운영한 세션" />
          <UserStatCell size="sm" icon={Users} value={user.playedCount} label="참여한 세션" />
        </Grid>
      </VStack>
    </Card.Root>
  );
}
