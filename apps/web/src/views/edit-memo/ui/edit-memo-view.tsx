import { Container } from "@roll-and-call/ui";
import { notFound, redirect } from "next/navigation";

import { MemoForm } from "@/features/profile-memo";
import { serverPath } from "@/shared/lib";
import {
  getCurrentSessionUser,
  getProfile,
  getProfileMemo,
  getCurrentServer,
} from "@/shared/server";

export async function EditMemoView({ id }: { id: string }) {
  const [server, viewer] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  if (!viewer) {
    const memoPath = serverPath({ slug: server.slug, path: `/u/${id}/memo` });
    redirect(`${serverPath({ slug: server.slug, path: "/" })}?next=${memoPath}`);
  }
  if (viewer.id === id) redirect(serverPath({ slug: server.slug, path: "/me" }));

  const [target, memo] = await Promise.all([
    getProfile(server.id, id),
    getProfileMemo({ serverId: server.id, ownerId: viewer.id, targetId: id }),
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
