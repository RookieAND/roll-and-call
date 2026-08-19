import { redirect } from "next/navigation";
import { Container, VStack } from "@trpg/ui";
import { getProfile } from "@/entities/profile/api/queries";
import { SignOutButton } from "@/features/auth";
import { EditProfileForm } from "@/features/profile";
import { getCurrentUser } from "@/shared/api/supabase/server";
import { AppBar } from "@/shared/ui/app-bar";

export async function EditProfileView() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const profile = await getProfile(user.id);
  const avatar =
    profile?.avatarUrl ?? (user.user_metadata.avatar_url as string | undefined) ?? null;

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
