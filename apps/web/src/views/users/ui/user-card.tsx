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

interface UserCardProps {
  user: UsersListItem;
}

// 닉네임·성향·소개 자리를 고정해 모든 카드에서 같은 위치에 두고, 수치 칸은 맨 아래에 붙인다. 성향이 없으면 점선 칩으로 비었다고 보인다.
// 카드 전체가 링크면 수치 칸 링크를 품을 수 없어, 위쪽 정보 영역과 수치 칸을 각각 링크로 둔다.
export function UserCard({ user }: UserCardProps) {
  const sessionsPath = (role: SessionRole, past?: boolean) =>
    userSessionsHref({ userId: user.userId, role, past });
  const recruitingPath = sessionsPath(SESSION_ROLE.host);
  const upcomingPath = sessionsPath(SESSION_ROLE.player);
  const hostedPath = sessionsPath(SESSION_ROLE.host, true);
  const playedPath = sessionsPath(SESSION_ROLE.player, true);
  return (
    <Card.Root padding="none" className="relative flex h-full flex-col overflow-hidden">
      <UserMonthRibbons medals={user.medals} size="md" />
      <ServerLink
        path={`/users/${user.userId}`}
        className="flex flex-1 flex-col transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-tinted-ink"
      >
        <div className="relative aspect-[3/1] w-full overflow-hidden bg-primary-100">
          {user.bannerUrl && <BannerImage src={user.bannerUrl} />}
        </div>
        <VStack gap="125" className="flex-1 px-200">
          <span className="relative -mt-9 flex w-fit rounded-full bg-surface p-050">
            <Avatar src={user.avatarUrl} name={user.username} size="2xl" />
          </span>
          <VStack gap="100" className="min-w-0">
            <HStack align="center" gap="100" className="h-7 min-w-0">
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
            <Text
              typography="body4"
              foreground={user.bio ? "muted" : "hint"}
              className="line-clamp-2 h-[2lh]"
            >
              {user.bio || EMPTY_BIO}
            </Text>
          </VStack>
        </VStack>
      </ServerLink>
      <Grid cols={2} gap="075" className="px-200 pt-125 pb-200">
        <UserStatCell
          icon={Megaphone}
          value={user.recruitingCount}
          label="모집 중인 세션"
          path={recruitingPath}
          tinted={user.recruitingCount > 0}
        />
        <UserStatCell
          icon={CalendarClock}
          value={user.upcomingCount}
          label="참여 예정 세션"
          path={upcomingPath}
          tinted={user.upcomingCount > 0}
        />
        <UserStatCell icon={Flag} value={user.hostedCount} label="운영한 세션" path={hostedPath} />
        <UserStatCell icon={Users} value={user.playedCount} label="참여한 세션" path={playedPath} />
      </Grid>
    </Card.Root>
  );
}
