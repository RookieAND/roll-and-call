import { cn, IconButton, Text, VStack } from "@roll-and-call/ui";
import { Pencil } from "lucide-react";
import type { ReactNode } from "react";

import {
  ACCENT_TINT_HOVER,
  ACCENT_TINT_TEXT,
  AccentScope,
  KeywordChips,
  PlayStyleBlock,
  ProfileHero,
  ProfileLinks,
  type AvailabilityInterval,
  type ProfileLink,
} from "@/entities/profile";
import { ServerLink } from "@/shared/ui";
import { SessionCountStats } from "@/widgets/session-list";

import { MyPageAvailability } from "./my-page-availability";
import { MyPageFeaturedBadges, type FeaturedBadge } from "./my-page-featured-badges";

interface MyPageProfileProps {
  notices: ReactNode;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  playStyle: string | null;
  bannerUrl: string | null;
  accentColor: string | null;
  links: ProfileLink[];
  discordId?: string;
  featuredBadges: FeaturedBadge[];
  heldBadgeCount: number;
  keywords: string[];
  availability: AvailabilityInterval[];
  hosted: { count: number; href: string };
  played: { count: number; href: string };
}

export function MyPageProfile({
  notices,
  name,
  avatarUrl,
  bio,
  playStyle,
  bannerUrl,
  accentColor,
  links,
  discordId,
  featuredBadges,
  heldBadgeCount,
  keywords,
  availability,
  hosted,
  played,
}: MyPageProfileProps) {
  const bioText = bio || "한 줄 소개를 적어 보세요.";
  const bioForeground = bio ? "muted" : "hint";

  return (
    <AccentScope accentColor={accentColor}>
      <VStack gap="175" render={<section />}>
        {notices}
        <ProfileHero
          className="-mt-225"
          name={name}
          avatarUrl={avatarUrl}
          bannerUrl={bannerUrl}
          accentColor={accentColor}
          action={
            <IconButton
              render={<ServerLink path={"/me/edit"} />}
              variant="ghost"
              size="lg"
              aria-label="프로필 편집"
              className={cn(
                "-mb-075 h-10 w-10 desktop:mb-0 desktop:h-11 desktop:w-11",
                ACCENT_TINT_TEXT,
                ACCENT_TINT_HOVER,
              )}
            >
              <Pencil size={18} aria-hidden />
            </IconButton>
          }
        />
        <VStack gap="025" className="min-w-0">
          <Text
            typography="heading3"
            weight="extrabold"
            truncate
            className="desktop:text-heading1"
            render={<h2 />}
          >
            {name}
          </Text>
          <Text typography="body3" foreground={bioForeground}>
            {bioText}
          </Text>
        </VStack>

        {links.length > 0 && (
          <div className="desktop:hidden">
            <ProfileLinks links={links} discordId={discordId} variant="circle" />
          </div>
        )}

        {keywords.length > 0 && <KeywordChips keywords={keywords} />}

        <SessionCountStats hosted={hosted} played={played} />

        {featuredBadges.length > 0 && (
          <MyPageFeaturedBadges badges={featuredBadges} heldCount={heldBadgeCount} />
        )}

        <PlayStyleBlock playStyle={playStyle} showEmpty />

        <div className="desktop:hidden">
          <MyPageAvailability availability={availability} />
        </div>
      </VStack>
    </AccentScope>
  );
}
