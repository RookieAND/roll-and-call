import { heldBadges, pickFeaturedBadges } from "@/entities/badge";
import { SESSION_ROLE } from "@/entities/game";
import { profileDisplay } from "@/entities/profile";
import { heldBadgeDetail } from "@/features/view-badge";
import { serverPath } from "@/shared/lib";
import { getCurrentSessionUser, getUserBadges, getCurrentServer } from "@/shared/server";
import { sessionsHref } from "@/widgets/session-list";

import { loadMyBadgeFacts } from "../api/load-my-badge-facts";
import { loadMyPageSessions } from "../api/load-my-page-sessions";
import { loadMyProfile } from "../api/load-my-profile";
import { MyPageProfile } from "./my-page-profile";

export async function MyPageSummary() {
  const user = (await getCurrentSessionUser())!;
  const server = await getCurrentServer();
  const [profile, mySessions, badgeRecords, badgeFacts] = await Promise.all([
    loadMyProfile(user.id),
    loadMyPageSessions(server.id, user.id),
    getUserBadges(server.id, user.id),
    loadMyBadgeFacts(user.id),
  ]);
  const now = new Date();
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
      name={name}
      avatarUrl={avatar}
      bio={profile?.bio ?? null}
      featuredBadges={featuredBadges}
      heldBadgeCount={held.length}
      keywords={profile?.keywords ?? []}
      availability={profile?.availability ?? []}
      hosted={{
        count: mySessions[SESSION_ROLE.host].length,
        href: serverPath({ slug: server.slug, path: sessionsHref({ role: SESSION_ROLE.host }) }),
      }}
      played={{
        count: mySessions[SESSION_ROLE.player].length,
        href: serverPath({
          slug: server.slug,
          path: sessionsHref({ role: SESSION_ROLE.player }),
        }),
      }}
    />
  );
}
