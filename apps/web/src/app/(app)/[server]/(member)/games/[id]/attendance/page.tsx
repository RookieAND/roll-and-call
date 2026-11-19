import { isString } from "es-toolkit";
import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { GameAttendanceView } from "@/views/game-attendance";

export const metadata: Metadata = { title: "출석 확인" };
export default async function Page({
  params,
  searchParams,
}: PageProps<"/[server]/games/[id]/attendance">) {
  await requireMembership();
  const [{ id }, { round }] = await Promise.all([params, searchParams]);
  return <GameAttendanceView id={id} round={isString(round) ? round : undefined} />;
}
