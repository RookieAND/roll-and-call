import { findActiveSanction } from "@roll-and-call/database/moderation";

import { countBadges, heldBadges, pickFeaturedBadges } from "@/entities/badge";
import { AbsenceNotice, countRecordSessions, recentAbsences, SESSION_ROLE } from "@/entities/game";
import { profileDisplay } from "@/entities/profile";
import { heldBadgeDetail } from "@/features/view-badge";
import { serverPath } from "@/shared/lib";
import { getCurrentSessionUser, getUserBadges, getCurrentServer } from "@/shared/server";
import { sessionsHref } from "@/widgets/session-list";

import { loadMyBadgeFacts } from "../api/load-my-badge-facts";
import { loadMyPageSessions } from "../api/load-my-page-sessions";
import { loadMyProfile } from "../api/load-my-profile";
import { MyPageProfile } from "./my-page-profile";
import { MyPageSanctionNotice } from "./my-page-sanction-notice";

export async function MyPageSummary() {
  const user = (await getCurrentSessionUser())!;
  const server = await getCurrentServer();
  const now = new Date();
  const [profile, { hosted, joined }, badgeRecords, badgeFacts, sanction] = await Promise.all([
    loadMyProfile(user.id),
    loadMyPageSessions(server.id, user.id),
    getUserBadges(server.id, user.id),
    loadMyBadgeFacts(user.id),
    findActiveSanction({ serverId: server.id, userId: user.id, now }),
  ]);
  const counts = countRecordSessions({
    hosted,
    joined,
    userId: user.id,
    now,
    includeUpcoming: true,
    includeWaiting: true,
  });
  const absences = recentAbsences({ joined, userId: user.id, now });
  const held = heldBadges(badgeRecords, now);
  const featuredBadges = pickFeaturedBadges({
    featuredKeys: profile?.featuredBadges ?? [],
    held,
  }).map((badge) => ({
    ...badge,
    detail: heldBadgeDetail({ badge, records: badgeRecords, facts: badgeFacts, now }),
  }));
  const { name, avatar } = profileDisplay({ profile, user });

  return (
    <MyPageProfile
      notices={
        <>
          {sanction && <MyPageSanctionNotice reason={sanction.reason} until={sanction.until} />}
          <AbsenceNotice absences={absences} />
        </>
      }
      name={name}
      avatarUrl={avatar}
      bio={profile?.bio ?? null}
      playStyle={profile?.playStyle ?? null}
      bannerUrl={profile?.bannerUrl ?? null}
      accentColor={profile?.accentColor ?? null}
      links={profile?.links ?? []}
      discordId={profile?.discordId}
      featuredBadges={featuredBadges}
      heldBadgeCount={countBadges(badgeRecords, now).total}
      keywords={profile?.keywords ?? []}
      availability={profile?.availability ?? []}
      hosted={{
        count: counts.hosted,
        href: serverPath({ slug: server.slug, path: sessionsHref({ role: SESSION_ROLE.host }) }),
      }}
      played={{
        count: counts.played,
        href: serverPath({
          slug: server.slug,
          path: sessionsHref({ role: SESSION_ROLE.player }),
        }),
      }}
    />
  );
}
