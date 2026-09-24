import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { getUserDetail, requireStaff } from "@/shared/server";
import { UserSanctionView } from "@/views/user-sanction";

export async function generateMetadata({
  params,
}: PageProps<"/users/[id]/sanction">): Promise<Metadata> {
  const user = await getUserDetail((await params).id);
  return { title: user ? `${user.nickname} 제재` : "제재" };
}

export default async function UserSanctionPage({ params }: PageProps<"/users/[id]/sanction">) {
  const [{ id }] = await Promise.all([params, requireStaff()]);
  const user = await getUserDetail(id);
  if (!user) notFound();
  if (user.sanction) redirect(`/users/${id}`);
  return <UserSanctionView user={user} />;
}
