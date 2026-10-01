import { heldBadges, pickFeaturedBadges } from "@/entities/badge";
import { SESSION_ROLE } from "@/entities/game";
import { profileDisplay } from "@/entities/profile";
import { CERT_STATE } from "@/entities/rulebook";
import { heldBadgeDetail } from "@/features/view-badge";
import { getCurrentSessionUser, getUserBadges, getCurrentServer } from "@/shared/server";
import { sessionsHref } from "@/widgets/session-list";

import { loadMyBadgeFacts } from "../api/load-my-badge-facts";
import { loadMyPageSessions } from "../api/load-my-page-sessions";
import { loadMyProfile } from "../api/load-my-profile";
import { loadMyRulebooks } from "../api/load-my-rulebooks";
import { sessionTodos } from "../model/session-todos";
import { MyPageProfile } from "./my-page-profile";
import { MyPageTodos } from "./my-page-todos";

export async function MyPageSummary() {
  const user = (await getCurrentSessionUser())!;
  const server = await getCurrentServer();
  const [profile, mySessions, rulebooks, badgeRecords, badgeFacts] = await Promise.all([
    loadMyProfile(user.id),
    loadMyPageSessions(user.id),
    loadMyRulebooks(user.id),
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
  const rejectedRulebooks = rulebooks.rulebooks.filter(
    (rulebook) => rulebook.state === CERT_STATE.rejected,
  );

  return (
    <>
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
          href: sessionsHref({ role: SESSION_ROLE.host }),
        }}
        played={{
          count: mySessions[SESSION_ROLE.player].length,
          href: sessionsHref({ role: SESSION_ROLE.player }),
        }}
      />
      <MyPageTodos todos={sessionTodos(mySessions)} rejectedRulebooks={rejectedRulebooks} />
    </>
  );
}
