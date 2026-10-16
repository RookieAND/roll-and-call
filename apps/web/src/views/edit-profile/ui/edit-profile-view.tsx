import { Container, VStack } from "@roll-and-call/ui";

import { profileDisplay } from "@/entities/profile";
import { LoginRequired } from "@/features/auth";
import { getProfile, getCurrentSessionUser, getCurrentServer } from "@/shared/server";
import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

import { EditProfileWithBanner } from "./edit-profile-with-banner";

export async function EditProfileView() {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  const profile = user ? await getProfile(server.id, user.id) : null;

  const display = user ? profileDisplay({ profile, user }) : null;

  return (
    <PageShell readable appBar={<AppBar back="/me" title="프로필 편집" />}>
      <div className={DESKTOP_CARD_CLASS}>
        <Container size="md">
          <VStack gap="300" className="py-300">
            {user && display ? (
              <EditProfileWithBanner
                serverId={server.id}
                serverName={server.name}
                defaultUsername={profile?.username ?? ""}
                defaultBio={profile?.bio ?? ""}
                defaultPlayStyle={profile?.playStyle ?? ""}
                defaultBannerUrl={profile?.bannerUrl ?? ""}
                defaultAccentColor={profile?.accentColor ?? ""}
                defaultKeywords={profile?.keywords ?? []}
                defaultLinks={profile?.links ?? []}
                availability={profile?.availability ?? []}
                avatarUrl={display.avatar}
                discordHandle={display.handle}
              />
            ) : (
              <LoginRequired />
            )}
          </VStack>
        </Container>
      </div>
    </PageShell>
  );
}
