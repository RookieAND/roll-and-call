import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { serverPath } from "@/shared/lib";
import { getCurrentServer, getMemberOngoing, getUserDetail, requireStaff } from "@/shared/server";
import { UserSanctionView } from "@/views/user-sanction";

export async function generateMetadata({
  params,
}: PageProps<"/[server]/users/[id]/sanction">): Promise<Metadata> {
  const user = await getUserDetail((await params).id);
  return { title: user ? `${user.nickname} 제재` : "제재" };
}

export default async function UserSanctionPage({
  params,
}: PageProps<"/[server]/users/[id]/sanction">) {
  const [{ id }, server] = await Promise.all([params, getCurrentServer(), requireStaff()]);
  const [user, ongoing] = await Promise.all([getUserDetail(id), getMemberOngoing(id)]);
  if (!user) notFound();
  if (user.sanction) redirect(serverPath({ slug: server.slug, path: `/users/${id}` }));
  return (
    <UserSanctionView user={user} ongoing={ongoing} staffChannel={Boolean(server.staffChannelId)} />
  );
}
