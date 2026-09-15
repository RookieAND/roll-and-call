import { Container } from "@trpg/ui";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/shared/server";
import { AppBar } from "@/shared/ui";
import { loadProfile, PROFILE_SESSION_SECTIONS } from "@/widgets/session-list";

import { ProfileSectionDivider } from "./profile-section-divider";
import { ProfileSessionSection } from "./profile-session-section";
import { ProfileStats } from "./profile-stats";
import { ProfileSummary } from "./profile-summary";
import { UnknownUser } from "./unknown-user";
import { UsualAvailability } from "./usual-availability";

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

  const { profile, sessions, stance } = loaded;

  return (
    <>
      <AppBar back="/games" title="프로필" />
      <Container size="sm" className="px-0">
        <ProfileSummary profile={profile} stance={stance} />
        <UsualAvailability slots={profile.defaultSlots} />
        <ProfileStats
          hosted={sessions.hosted.length}
          upcoming={sessions.upcoming.length}
          past={sessions.past.length}
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
