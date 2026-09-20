import { Container } from "@trpg/ui";
import { redirect } from "next/navigation";

import { SESSION_ROLE } from "@/entities/game";
import { AvailabilityRows, ProfileLinks } from "@/entities/profile";
import { ProfileMemoBlock } from "@/features/profile-memo";
import { getCurrentUser, getProfileMemo } from "@/shared/server";
import { AppBar } from "@/shared/ui";
import { loadProfile, PROFILE_SESSION_SECTIONS } from "@/widgets/session-list";

import { ProfileBlockLabel } from "./profile-block-label";
import { ProfileSectionDivider } from "./profile-section-divider";
import { ProfileSessionSection } from "./profile-session-section";
import { ProfileStats } from "./profile-stats";
import { ProfileSummary } from "./profile-summary";
import { UnknownUser } from "./unknown-user";

export async function UserProfileView({ id }: { id: string }) {
  const [viewer, loaded] = await Promise.all([getCurrentUser(), loadProfile(id)]);
  if (viewer?.id === id) redirect("/me");

  if (!loaded) {
    return (
      <>
        <AppBar back="/games" title="프로필" />
        <Container size="sm" className="px-0">
          <UnknownUser />
        </Container>
      </>
    );
  }

  const { profile, sessions } = loaded;
  const memo = viewer ? await getProfileMemo({ ownerId: viewer.id, targetId: id }) : null;

  return (
    <>
      <AppBar back="/games" title="프로필" />
      <Container size="sm" className="px-0">
        <ProfileSummary profile={profile} />

        <section className="p-4">
          <ProfileBlockLabel label="링크" />
          <ProfileLinks links={profile.links} />
        </section>

        <section className="px-4 pb-4">
          <ProfileBlockLabel label="가능 시간대" />
          <AvailabilityRows intervals={profile.availability} note="프로필 기본값입니다." />
        </section>

        {viewer && (
          <ProfileMemoBlock targetId={profile.id} memo={memo} />
        )}

        <ProfileStats
          hosted={sessions[SESSION_ROLE.host].length}
          played={sessions[SESSION_ROLE.player].length}
        />

        {PROFILE_SESSION_SECTIONS.map((section) => (
          <div key={section.key}>
            <ProfileSectionDivider />
            <ProfileSessionSection
              userId={profile.id}
              section={section}
              items={sessions[section.key]}
            />
          </div>
        ))}
      </Container>
    </>
  );
}
