import type { Metadata } from "next";

import { getProfile } from "@/shared/server";
import { UserSessionsView } from "@/views/user-sessions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const profile = await getProfile(id);
  const name = profile?.username ?? "유저";
  return { title: `${name}의 세션` };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const [{ id }, { tab }] = await Promise.all([params, searchParams]);
  return <UserSessionsView id={id} tab={tab} />;
}
