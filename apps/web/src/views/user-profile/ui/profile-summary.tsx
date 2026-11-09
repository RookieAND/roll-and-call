import type { MemberProfile } from "@roll-and-call/database/profiles";
import { getMemberRole } from "@roll-and-call/database/servers";
import { HStack, Text, VStack } from "@roll-and-call/ui";

import { AbsenceNotice, SESSION_ROLE, type Absence } from "@/entities/game";
import { EMPTY_BIO_TEXT, KeywordChips, ProfileHero, ProfileLinks } from "@/entities/profile";
import { toKst, serverPath } from "@/shared/lib";
import { getCurrentServer } from "@/shared/server";
import { SessionCountStats, userSessionsHref } from "@/widgets/session-list";

import { ProfileBadges, type ProfileFeaturedBadge } from "./profile-badges";
import { ProfilePlayStyle } from "./profile-play-style";
import { ProfileRoleMark } from "./profile-role-mark";

interface ProfileSummaryProps {
  profile: MemberProfile;
  absences: Absence[];
  hosted: number;
  played: number;
  featuredBadges: ProfileFeaturedBadge[];
  badgeTotal: number;
}

export async function ProfileSummary({
  profile,
  absences,
  hosted,
  played,
  featuredBadges,
  badgeTotal,
}: ProfileSummaryProps) {
  const server = await getCurrentServer();
  const role = await getMemberRole({ serverId: server.id, userId: profile.id });
  const joinedLabel = toKst(profile.joinedAt).format("YYYY년 M월부터");
  const bioText = profile.bio || `${EMPTY_BIO_TEXT}.`;
  const bioForeground = profile.bio ? "normal" : "hint";

  return (
    <div className="px-200 pb-250">
      {absences.length > 0 && (
        <div className="pt-250 pb-200">
          <AbsenceNotice absences={absences} />
        </div>
      )}
      <ProfileHero
        name={profile.username}
        avatarUrl={profile.avatarUrl}
        bannerUrl={profile.bannerUrl}
      />
      <VStack gap="025" className="mt-175 min-w-0">
        <HStack align="center" gap="075" className="min-w-0">
          <Text
            typography="heading2"
            truncate
            className="desktop:text-heading1 desktop:tracking-tight"
            render={<h2 />}
          >
            {profile.username}
          </Text>
          {role && <ProfileRoleMark role={role} />}
        </HStack>
        <Text typography="body3" foreground="hint">
          {joinedLabel}
        </Text>
      </VStack>
      <Text
        typography="body2"
        foreground={bioForeground}
        render={<p />}
        className="mt-175 text-pretty"
      >
        {bioText}
      </Text>
      {profile.links.length > 0 && (
        <div className="mt-175 desktop:hidden">
          <ProfileLinks links={profile.links} discordId={profile.discordId} variant="circle" />
        </div>
      )}
      {profile.keywords.length > 0 && (
        <div className="mt-175">
          <KeywordChips keywords={profile.keywords} />
        </div>
      )}
      <div className="mt-175">
        <SessionCountStats
          hosted={{
            count: hosted,
            href: serverPath({
              slug: server.slug,
              path: userSessionsHref({ userId: profile.id, role: SESSION_ROLE.host }),
            }),
          }}
          played={{
            count: played,
            href: serverPath({
              slug: server.slug,
              path: userSessionsHref({ userId: profile.id, role: SESSION_ROLE.player }),
            }),
          }}
        />
      </div>
      {featuredBadges.length > 0 && (
        <div className="mt-175">
          <ProfileBadges userId={profile.id} featured={featuredBadges} total={badgeTotal} />
        </div>
      )}
      {profile.playStyle && (
        <div className="mt-175">
          <ProfilePlayStyle playStyle={profile.playStyle} />
        </div>
      )}
    </div>
  );
}
