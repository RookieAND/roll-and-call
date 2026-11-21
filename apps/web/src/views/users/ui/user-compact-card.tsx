import { Avatar, Card, Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { Book, Flag, Megaphone, Users } from "lucide-react";

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

// 모바일 카드. 훑어보기 쉽게 배너는 얇은 띠, 소개는 한 줄로 줄이고, 수치는 데스크톱과 같은 칸을 한 단계 작게 쓴다.
export function UserCompactCard({ user }: UserCompactCardProps) {
  const bioForeground = user.bio ? "muted" : "hint";
  return (
    <Card.Root
      padding="none"
      interactive
      render={<ServerLink path={`/users/${user.userId}`} />}
      className="block overflow-hidden"
    >
      <div className="relative h-12 w-full overflow-hidden bg-primary-100">
        {user.bannerUrl && <BannerImage src={user.bannerUrl} />}
      </div>
      <VStack gap="100" className="px-150 pb-150">
        <span className="relative -mt-300 flex w-fit rounded-full bg-surface p-050">
          <Avatar src={user.avatarUrl} name={user.username} size="lg" />
        </span>
        <HStack align="center" gap="075" className="min-w-0">
          <Text truncate typography="subtitle1">
            {user.username}
          </Text>
          <MemberTitle userId={user.userId} />
          <UserMonthMedals medals={user.medals} />
        </HStack>
        <KeywordChips
          keywords={user.keywords.slice(0, KEYWORD_LIMIT)}
          size="md"
          hideEmpty
          className="h-7 min-w-0 overflow-hidden"
        />
        <Text truncate typography="body4" foreground={bioForeground}>
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
            icon={Book}
            value={user.certifiedRulebookCount}
            label="인증 룰북"
          />
          <UserStatCell size="sm" icon={Flag} value={user.hostedCount} label="운영한 세션" />
          <UserStatCell size="sm" icon={Users} value={user.playedCount} label="참여한 세션" />
        </Grid>
      </VStack>
    </Card.Root>
  );
}
