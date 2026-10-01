import { Container } from "@roll-and-call/ui";
import { notFound, redirect } from "next/navigation";

import { heldBadges, pickFeaturedBadges } from "@/entities/badge";
import { SESSION_ROLE } from "@/entities/game";
import { AvailabilityRows, ProfileLinks } from "@/entities/profile";
import { CERT_STATE, toMyRulebooks } from "@/entities/rulebook";
import { ProfileMemoBlock } from "@/features/profile-memo";
import { heldBadgeDetail } from "@/features/view-badge";
import {
  getCurrentSessionUser,
  getProfileMemo,
  getReviewCounts,
  getRulebookRecords,
  getUserBadges,
  getCurrentServer,
} from "@/shared/server";
import { AppBar } from "@/shared/ui";
import { loadProfile } from "@/widgets/session-list";

import { ProfileBlockLabel } from "./profile-block-label";
import { ProfileReviews } from "./profile-reviews";
import { ProfileRulebooks } from "./profile-rulebooks";
import { ProfileSummary } from "./profile-summary";

export async function UserProfileView({ id }: { id: string }) {
  const server = await getCurrentServer();
  const viewerPromise = getCurrentSessionUser();
  const [viewer, loaded, rulebookRecords, reviewCounts, badgeRecords, memo] = await Promise.all([
    viewerPromise,
    loadProfile(id),
    getRulebookRecords({ serverId: server.id, userId: id }),
    getReviewCounts({ serverId: server.id, userId: id }),
    getUserBadges(server.id, id),
    viewerPromise.then((currentViewer) =>
      currentViewer
        ? getProfileMemo({ serverId: server.id, ownerId: currentViewer.id, targetId: id })
        : null,
    ),
  ]);
  if (viewer?.id === id) redirect("/me");

  if (!loaded) notFound();

  const { profile, sessions, absences } = loaded;
  const certified = toMyRulebooks(rulebookRecords)
    .rulebooks.filter((rulebook) => rulebook.state === CERT_STATE.certified)
    .toSorted((left, right) => right.stateAt!.getTime() - left.stateAt!.getTime())
    .map((rulebook) => ({ id: rulebook.id, label: rulebook.label }));
  const isGm = certified.length > 0;
  const now = new Date();
  const held = profile.showBadges ? heldBadges(badgeRecords, now) : [];
  const featuredBadges = pickFeaturedBadges({ featuredKeys: profile.featuredBadges, held }).map(
    (badge) => ({
      ...badge,
      detail: heldBadgeDetail({ badge, records: badgeRecords, facts: null, now }),
    }),
  );

  return (
    <>
      <AppBar back="/games" title="프로필" />
      <Container size="sm" className="px-0">
        <ProfileSummary
          profile={profile}
          absences={absences}
          hosted={sessions[SESSION_ROLE.host].length}
          played={sessions[SESSION_ROLE.player].length}
          featuredBadges={featuredBadges}
          badgeTotal={held.length}
        />

        {certified.length > 0 && <ProfileRulebooks rulebooks={certified} />}

        <ProfileReviews
          userId={profile.id}
          received={isGm ? reviewCounts.received : null}
          written={reviewCounts.written}
        />

        <section className="p-200">
          <ProfileBlockLabel label="링크" />
          <ProfileLinks links={profile.links} />
        </section>

        <section className="px-200 pb-200">
          <ProfileBlockLabel label="가능 시간대" />
          <AvailabilityRows intervals={profile.availability} />
        </section>

        {viewer && (
          <ProfileMemoBlock targetId={profile.id} targetName={profile.username} memo={memo} />
        )}
      </Container>
    </>
  );
}
