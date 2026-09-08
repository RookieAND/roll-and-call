import { redirect } from "next/navigation";
import { Container, VStack } from "@trpg/ui";
import { profileDisplay } from "@/entities/profile";
import { getProfile, getCurrentUser } from "@/shared/server";
import { SignOutButton } from "@/features/auth";
import { EditProfileForm } from "@/features/edit-profile";
import { AppBar } from "@/shared/ui";
export async function EditProfileView() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const profile = await getProfile(user.id);
  const { avatar } = profileDisplay({ profile, user });

  return (
    <>
      <AppBar back="/me" title="프로필 편집" />
      <Container size="md">
        <VStack gap={6} className="py-6">
          <EditProfileForm
            defaultUsername={profile?.username ?? ""}
            defaultBio={profile?.bio ?? ""}
            defaultSlots={profile?.defaultSlots ?? []}
            avatarUrl={avatar}
          />
          <div className="border-t border-gray-200 pt-4">
            <SignOutButton className="h-[46px] w-full" />
          </div>
        </VStack>
      </Container>
    </>
  );
}
