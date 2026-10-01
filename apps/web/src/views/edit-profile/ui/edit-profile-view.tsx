import { Container, VStack } from "@roll-and-call/ui";

import { profileDisplay } from "@/entities/profile";
import { LoginRequired } from "@/features/auth";
import { EditProfileForm } from "@/features/edit-profile";
import { getProfile, getCurrentSessionUser } from "@/shared/server";
import { AppBar } from "@/shared/ui";

export async function EditProfileView() {
  const user = await getCurrentSessionUser();
  const profile = user ? await getProfile(user.id) : null;

  return (
    <>
      <AppBar back="/me" title="프로필 편집" />
      <Container size="md">
        <VStack gap="300" className="py-300">
          {user ? (
            <EditProfileForm
              defaultUsername={profile?.username ?? ""}
              defaultBio={profile?.bio ?? ""}
              defaultKeywords={profile?.keywords ?? []}
              defaultLinks={profile?.links ?? []}
              availability={profile?.availability ?? []}
              avatarUrl={profileDisplay({ profile, user }).avatar}
            />
          ) : (
            <LoginRequired />
          )}
        </VStack>
      </Container>
    </>
  );
}
