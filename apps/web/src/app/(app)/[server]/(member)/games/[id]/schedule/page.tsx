import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { GameScheduleView } from "@/views/game-schedule";

export const metadata: Metadata = { title: "일정 조율" };

export default async function Page({
  params,
  searchParams,
}: PageProps<"/[server]/games/[id]/schedule">) {
  await requireMembership();
  const [{ id }, { round }] = await Promise.all([params, searchParams]);
  return <GameScheduleView id={id} round={typeof round === "string" ? round : undefined} />;
}
