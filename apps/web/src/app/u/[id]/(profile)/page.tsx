import type { Metadata } from "next";

import { getProfile } from "@/shared/server";
import { UserProfileView } from "@/views/user-profile";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const profile = await getProfile(id);
  return { title: profile?.username ?? "프로필" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UserProfileView id={id} />;
}
