import { getRulebookRecords } from "@roll-and-call/database/certifications";
import { getProfileMemo } from "@roll-and-call/database/profiles";
import { getReviewCounts } from "@roll-and-call/database/reviews";
import { Container } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { notFound, redirect } from "next/navigation";

import { countBadges, heldBadges, pickFeaturedBadges } from "@/entities/badge";
import { DepartedMemberScreen } from "@/entities/profile";
import { CERT_STATE, toMyRulebooks } from "@/entities/rulebook";
import { heldBadgeDetail } from "@/features/view-badge";
import { serverPath } from "@/shared/lib";
import { getCurrentSessionUser, getUserBadges, getCurrentServer } from "@/shared/server";
import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";
import { loadProfile } from "@/widgets/session-list/server";

import { ProfileReviews } from "./profile-reviews";
import { ProfileRulebooks } from "./profile-rulebooks";
import { ProfileSide } from "./profile-side";
import { ProfileSummary } from "./profile-summary";

interface UserProfileViewProps {
  id: string;
}

export async function UserProfileView({ id }: UserProfileViewProps) {
  const server = await getCurrentServer();
  const viewerPromise = getCurrentSessionUser();
  const [viewer, loaded, rulebookRecords, reviewCounts, badgeRecords, memo] = await Promise.all([
    viewerPromise,
    viewerPromise.then((currentViewer) =>
      loadProfile({ userId: id, viewerId: currentViewer?.id ?? null }),
    ),
    getRulebookRecords({ serverId: server.id, userId: id }),
    viewerPromise.then((currentViewer) =>
      getReviewCounts({ serverId: server.id, userId: id, viewerId: currentViewer?.id ?? null }),
    ),
    getUserBadges(server.id, id),
    viewerPromise.then((currentViewer) =>
      currentViewer
        ? getProfileMemo({ serverId: server.id, ownerId: currentViewer.id, targetId: id })
        : null,
    ),
  ]);
  if (viewer?.id === id) redirect(serverPath({ slug: server.slug, path: "/me" }));

  if (!loaded) notFound();

  const { profile, counts, absences } = loaded;
  if (!isNull(profile.deletedAt)) {
    return <DepartedMemberScreen name={profile.username} avatarUrl={profile.avatarUrl} />;
  }
  const certified = toMyRulebooks(rulebookRecords)
    .rulebooks.filter((rulebook) => rulebook.state === CERT_STATE.certified)
    .toSorted((left, right) => right.stateAt!.getTime() - left.stateAt!.getTime())
    .map((rulebook) => ({ id: rulebook.id, label: rulebook.label }));
  const now = new Date();
  const held = profile.showBadges ? heldBadges(badgeRecords, now) : [];
  const featuredBadges = pickFeaturedBadges({ featuredKeys: profile.featuredBadges, held }).map(
    (badge) => ({
      ...badge,
      detail: heldBadgeDetail({ badge, records: badgeRecords, facts: null, now }),
    }),
  );

  return (
    <PageShell
      readable
      scrollTop
      appBar={<AppBar back="/games" title={`${profile.username}님의 프로필`} />}
      panel={
        <div className="overflow-clip rounded-700 border border-gray-200 bg-surface">
          <ProfileSide profile={profile} signedIn={!!viewer} memo={memo} />
        </div>
      }
    >
      <div className={DESKTOP_CARD_CLASS}>
        <Container size="sm" className="px-0 desktop:max-w-none">
          <ProfileSummary
            profile={profile}
            absences={absences}
            hosted={counts.hosted}
            played={counts.played}
            featuredBadges={featuredBadges}
            badgeTotal={profile.showBadges ? countBadges(badgeRecords, now).total : 0}
          />

          {certified.length > 0 && <ProfileRulebooks rulebooks={certified} />}

          <ProfileReviews
            userId={profile.id}
            received={counts.hosted >= 1 ? reviewCounts.received : null}
            written={reviewCounts.written}
          />

          <div className="desktop:hidden">
            <ProfileSide profile={profile} signedIn={!!viewer} memo={memo} />
          </div>
        </Container>
      </div>
    </PageShell>
  );
}
