import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { serverPath } from "@/shared/lib";
import { getCurrentServer, getUserDetail, requireStaff } from "@/shared/server";
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
  const [{ id }] = await Promise.all([params, requireStaff()]);
  const user = await getUserDetail(id);
  if (!user) notFound();
  if (user.sanction) {
    const server = await getCurrentServer();
    redirect(serverPath({ slug: server.slug, path: `/users/${id}` }));
  }
  return <UserSanctionView user={user} />;
}
