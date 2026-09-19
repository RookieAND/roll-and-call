import { Container } from "@trpg/ui";
import { notFound, redirect } from "next/navigation";

import { MemoForm } from "@/features/profile-memo";
import { getCurrentUser, getProfile, getProfileMemo } from "@/shared/server";

export async function EditMemoView({ id }: { id: string }) {
  const viewer = await getCurrentUser();
  if (!viewer) redirect(`/?next=/u/${id}/memo`);
  if (viewer.id === id) redirect("/me");

  const [target, memo] = await Promise.all([
    getProfile(id),
    getProfileMemo({ ownerId: viewer.id, targetId: id }),
  ]);
  if (!target) notFound();

  return (
    <Container size="sm" className="px-0">
      <MemoForm
        targetId={target.id}
        targetName={target.username}
        targetAvatarUrl={target.avatarUrl}
        defaultBody={memo?.body ?? ""}
        updatedAt={memo?.updatedAt ?? null}
      />
    </Container>
  );
}
