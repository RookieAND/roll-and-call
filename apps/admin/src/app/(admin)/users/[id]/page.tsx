import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getUserDetail, requireStaff } from "@/shared/server";
import { ACTIVITY_ROLE, USER_DETAIL_TAB, UserDetailView } from "@/views/user-detail";

const TABS = Object.values(USER_DETAIL_TAB);
const ROLES = Object.values(ACTIVITY_ROLE);

export async function generateMetadata({ params }: PageProps<"/users/[id]">): Promise<Metadata> {
  const user = await getUserDetail((await params).id);
  return { title: user ? `${user.nickname} 유저 상세` : "유저 상세" };
}

export default async function UserDetailPage({ params, searchParams }: PageProps<"/users/[id]">) {
  const [{ id }, { tab, role }, staff] = await Promise.all([params, searchParams, requireStaff()]);
  const user = await getUserDetail(id);
  if (!user) notFound();
  return (
    <UserDetailView
      user={user}
      tab={TABS.find((candidate) => candidate === tab) ?? USER_DETAIL_TAB.activity}
      role={ROLES.find((candidate) => candidate === role) ?? ACTIVITY_ROLE.all}
      viewer={staff}
    />
  );
}
