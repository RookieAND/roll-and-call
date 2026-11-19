import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { RoundScheduleView } from "@/views/round-schedule";

export const metadata: Metadata = { title: "회차 일정" };

export default async function Page({
  params,
}: PageProps<"/[server]/games/[id]/rounds/[round]/schedule">) {
  await requireMembership();
  const { id, round } = await params;
  return <RoundScheduleView id={id} round={round} />;
}
