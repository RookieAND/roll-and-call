import { Button, HStack, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { KeywordChips, ProfileRow } from "@/entities/profile";
import { ServerLink } from "@/shared/ui";
import { SessionCountStats } from "@/widgets/session-list";

import { MyPageBlockLabel } from "./my-page-block-label";
import { MyPageFeaturedBadges, type FeaturedBadge } from "./my-page-featured-badges";

interface MyPageProfileProps {
  notices: ReactNode;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  featuredBadges: FeaturedBadge[];
  heldBadgeCount: number;
  keywords: string[];
  hosted: { count: number; href: string };
  played: { count: number; href: string };
}

export function MyPageProfile({
  notices,
  name,
  avatarUrl,
  bio,
  featuredBadges,
  heldBadgeCount,
  keywords,
  hosted,
  played,
}: MyPageProfileProps) {
  const bioText = bio || "한 줄 소개를 적어 주세요.";
  const bioForeground = bio ? "muted" : "hint";

  return (
    <VStack gap="175" render={<section />}>
      {notices}
      <HStack align="center" gap="175">
        <ProfileRow
          size="xl"
          name={name}
          avatarUrl={avatarUrl}
          nameRender={<h2 />}
          subline={bioText}
          sublineForeground={bioForeground}
        />
        <Button render={<ServerLink path={"/me/edit"} />} variant="outline" size="sm">
          편집
        </Button>
      </HStack>

      <SessionCountStats hosted={hosted} played={played} />

      {featuredBadges.length > 0 && (
        <MyPageFeaturedBadges badges={featuredBadges} heldCount={heldBadgeCount} />
      )}

      <div>
        <MyPageBlockLabel label="성향" />
        <KeywordChips keywords={keywords} />
      </div>
    </VStack>
  );
}
