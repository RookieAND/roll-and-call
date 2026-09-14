import { Container, VStack } from "@trpg/ui";
import { profileDisplay } from "@/entities/profile";
import { getProfile, getCurrentUser } from "@/shared/server";
import { LoginRequired } from "@/features/auth";
import { EditProfileForm } from "@/features/edit-profile";
import { AppBar } from "@/shared/ui";
// 로그아웃은 마이페이지 설정 한 곳에만 둔다.
export async function EditProfileView() {
  const user = await getCurrentUser();
  const profile = user ? await getProfile(user.id) : null;

  return (
    <>
      <AppBar back="/me" title="프로필 편집" />
      <Container size="md">
        <VStack gap={6} className="py-6">
          {user ? (
            <EditProfileForm
              defaultUsername={profile?.username ?? ""}
              defaultBio={profile?.bio ?? ""}
              defaultSlots={profile?.defaultSlots ?? []}
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
