import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SESSION_ROLE } from "@/entities/game";
import { isValueOf } from "@/shared/lib";
import { getCurrentServer, getProfile, requireMembership } from "@/shared/server";
import { SCHEDULE_TAB, UserSessionsView } from "@/views/user-sessions";

const isSessionRole = isValueOf(SESSION_ROLE);

interface PageProps {
  params: Promise<{ id: string; role: string }>;
  searchParams: Promise<{ tab?: string; date?: string; month?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await requireMembership();
  const { id, role } = await params;
  const server = await getCurrentServer();
  const profile = await getProfile(server.id, id);
  const name = profile?.username ?? "유저";
  const verb = role === SESSION_ROLE.host ? "운영" : "참여";
  return { title: `${name} 님의 ${verb} 세션 목록` };
}

export default async function Page({ params, searchParams }: PageProps) {
  await requireMembership();
  const [{ id, role }, { tab, date, month }] = await Promise.all([params, searchParams]);
  if (!isSessionRole(role)) notFound();
  const activeTab = tab === SCHEDULE_TAB.past ? SCHEDULE_TAB.past : SCHEDULE_TAB.upcoming;
  return <UserSessionsView id={id} role={role} tab={activeTab} date={date} month={month} />;
}
