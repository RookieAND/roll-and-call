import { Container } from "@roll-and-call/ui";
import { notFound, redirect } from "next/navigation";

import { SESSION_ROLE } from "@/entities/game";
import { AvailabilityRows, ProfileLinks } from "@/entities/profile";
import { CERT_STATE, toMyRulebooks } from "@/entities/rulebook";
import { ProfileMemoBlock } from "@/features/profile-memo";
import {
  getCurrentSessionUser,
  getProfileMemo,
  getReviewCounts,
  getRulebookRecords,
} from "@/shared/server";
import { AppBar } from "@/shared/ui";
import { loadProfile } from "@/widgets/session-list";

import { ProfileBlockLabel } from "./profile-block-label";
import { ProfileReviews } from "./profile-reviews";
import { ProfileRulebooks } from "./profile-rulebooks";
import { ProfileSummary } from "./profile-summary";

export async function UserProfileView({ id }: { id: string }) {
  const viewerPromise = getCurrentSessionUser();
  const [viewer, loaded, rulebookRecords, reviewCounts, memo] = await Promise.all([
    viewerPromise,
    loadProfile(id),
    getRulebookRecords(id),
    getReviewCounts(id),
    viewerPromise.then((currentViewer) =>
      currentViewer ? getProfileMemo({ ownerId: currentViewer.id, targetId: id }) : null,
    ),
  ]);
  if (viewer?.id === id) redirect("/me");

  if (!loaded) notFound();

  const { profile, sessions, absences } = loaded;
  // 인증된 룰북이 없으면 GM 표시와 블록을 통째로 숨긴다. 본인이 Player로 보이길 고르면 GM 표시만 숨긴다.
  const certified = toMyRulebooks(rulebookRecords)
    .rulebooks.filter((rulebook) => rulebook.state === CERT_STATE.certified)
    .toSorted((left, right) => right.stateAt!.getTime() - left.stateAt!.getTime())
    .map((rulebook) => ({ id: rulebook.id, label: rulebook.label }));
  const isGm = certified.length > 0 && profile.showGmBadge;

  return (
    <>
      <AppBar back="/games" title="프로필" />
      <Container size="sm" className="px-0">
        <ProfileSummary
          profile={profile}
          absences={absences}
          isGm={isGm}
          hosted={sessions[SESSION_ROLE.host].length}
          played={sessions[SESSION_ROLE.player].length}
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
