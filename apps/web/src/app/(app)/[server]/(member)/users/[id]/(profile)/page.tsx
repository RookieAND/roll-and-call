import type { Metadata } from "next";

import { getCurrentServer, getProfile, requireMembership } from "@/shared/server";
import { UserProfileView } from "@/views/user-profile";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  await requireMembership();
  const { id } = await params;
  const server = await getCurrentServer();
  const profile = await getProfile(server.id, id);
  return { title: profile?.username ?? "프로필" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireMembership();
  const { id } = await params;
  return <UserProfileView id={id} />;
}
