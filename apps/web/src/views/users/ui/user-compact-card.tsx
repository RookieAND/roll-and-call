import { Avatar, Card, Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { CalendarClock, Flag, Megaphone, Users } from "lucide-react";

import { SESSION_ROLE, type SessionRole } from "@/entities/game";
import { KeywordChips } from "@/entities/profile";
import { MemberTitle } from "@/features/view-badge";
import { BannerImage, ServerLink } from "@/shared/ui";
import { userSessionsHref } from "@/widgets/session-list";

import { EMPTY_BIO } from "../model/empty-bio";
import { KEYWORD_LIMIT } from "../model/keyword-limit";
import type { UsersListItem } from "../model/users-list-item";
import { UserMonthRibbons } from "./user-month-ribbons";
import { UserStatCell } from "./user-stat-cell";

interface UserCompactCardProps {
  user: UsersListItem;
}

// 모바일 카드. 배너·아바타는 데스크톱과 같은 비율로 두고, 소개는 두 줄까지 보이고, 수치는 데스크톱과 같은 칸을 한 단계 작게 쓴다.
export function UserCompactCard({ user }: UserCompactCardProps) {
  const bioForeground = user.bio ? "muted" : "hint";
  const sessionsPath = (role: SessionRole, past?: boolean) =>
    userSessionsHref({ userId: user.userId, role, past });
  const recruitingPath = sessionsPath(SESSION_ROLE.host);
  const upcomingPath = sessionsPath(SESSION_ROLE.player);
  const hostedPath = sessionsPath(SESSION_ROLE.host, true);
  const playedPath = sessionsPath(SESSION_ROLE.player, true);
  return (
    <Card.Root padding="none" className="relative block overflow-hidden">
      <UserMonthRibbons medals={user.medals} size="sm" />
      <ServerLink
        path={`/users/${user.userId}`}
        className="block transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-tinted-ink"
      >
        <div className="relative aspect-[3/1] w-full overflow-hidden bg-primary-100">
          {user.bannerUrl && <BannerImage src={user.bannerUrl} />}
        </div>
        <VStack gap="100" className="px-150">
          <span className="relative -mt-9 flex w-fit rounded-full bg-surface p-050">
            <Avatar src={user.avatarUrl} name={user.username} size="2xl" />
          </span>
          <HStack align="center" gap="075" className="min-w-0">
            <Text truncate typography="heading3">
              {user.username}
            </Text>
            <MemberTitle userId={user.userId} size="sm" />
          </HStack>
          <KeywordChips
            keywords={user.keywords.slice(0, KEYWORD_LIMIT)}
            size="md"
            className="h-7 min-w-0 overflow-hidden"
          />
          <Text typography="body4" foreground={bioForeground} className="line-clamp-2">
            {user.bio || EMPTY_BIO}
          </Text>
        </VStack>
      </ServerLink>
      <Grid cols={2} gap="075" className="px-150 pt-100 pb-150">
        <UserStatCell
          size="sm"
          icon={Megaphone}
          value={user.recruitingCount}
          label="모집 중인 세션"
          path={recruitingPath}
          tinted={user.recruitingCount > 0}
        />
        <UserStatCell
          size="sm"
          icon={CalendarClock}
          value={user.upcomingCount}
          label="참여 예정 세션"
          path={upcomingPath}
          tinted={user.upcomingCount > 0}
        />
        <UserStatCell
          size="sm"
          icon={Flag}
          value={user.hostedCount}
          label="운영한 세션"
          path={hostedPath}
        />
        <UserStatCell
          size="sm"
          icon={Users}
          value={user.playedCount}
          label="참여한 세션"
          path={playedPath}
        />
      </Grid>
    </Card.Root>
  );
}
