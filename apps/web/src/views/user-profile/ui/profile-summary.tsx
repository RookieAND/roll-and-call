import { Text } from "@roll-and-call/ui";

import { SESSION_ROLE } from "@/entities/game";
import { EMPTY_BIO_TEXT, KeywordChips, ProfileRow } from "@/entities/profile";
import { toKst } from "@/shared/lib";
import type { Profile } from "@/shared/server";
import { SessionCountStats, userSessionsHref, type Absence } from "@/widgets/session-list";

import { ProfileAbsenceNotice } from "./profile-absence-notice";
import { ProfileBadges, type ProfileFeaturedBadge } from "./profile-badges";
import { ProfileBlockLabel } from "./profile-block-label";

interface ProfileSummaryProps {
  profile: Profile;
  absences: Absence[];
  hosted: number;
  played: number;
  featuredBadges: ProfileFeaturedBadge[];
  badgeTotal: number;
}

export function ProfileSummary({
  profile,
  absences,
  hosted,
  played,
  featuredBadges,
  badgeTotal,
}: ProfileSummaryProps) {
  const joinedLabel = toKst(profile.createdAt).format("YYYY년 M월부터");
  const bioText = profile.bio || EMPTY_BIO_TEXT;
  const bioForeground = profile.bio ? "normal" : "hint";

  return (
    <div className="px-200 pt-250 pb-050">
      {absences.length > 0 && (
        <div className="mb-200">
          <ProfileAbsenceNotice absences={absences} />
        </div>
      )}
      <ProfileRow
        size="xl"
        name={profile.username}
        avatarUrl={profile.avatarUrl}
        nameRender={<h2 />}
        subline={joinedLabel}
        sublineForeground="hint"
      />
      <Text
        typography="body2"
        foreground={bioForeground}
        render={<p />}
        className="mt-175 [text-wrap:pretty]"
      >
        {bioText}
      </Text>
      <div className="mt-175">
        <SessionCountStats
          hosted={{
            count: hosted,
            href: userSessionsHref({ userId: profile.id, role: SESSION_ROLE.host }),
          }}
          played={{
            count: played,
            href: userSessionsHref({ userId: profile.id, role: SESSION_ROLE.player }),
          }}
        />
      </div>
      {featuredBadges.length > 0 && (
        <div className="mt-175">
          <ProfileBadges userId={profile.id} featured={featuredBadges} total={badgeTotal} />
        </div>
      )}
      <div className="mt-175">
        <ProfileBlockLabel label="성향" />
        <KeywordChips keywords={profile.keywords} />
      </div>
    </div>
  );
}
