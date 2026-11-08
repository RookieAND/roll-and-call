import type { Metadata } from "next";
import { after } from "next/server";

import { detectRosterDepartures, getCurrentServer, requireMembership } from "@/shared/server";
import { SplitTeamsView } from "@/views/split-teams";

export const metadata: Metadata = { title: "팀 나누기" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireMembership();
  const [{ id }, server] = await Promise.all([params, getCurrentServer()]);
  after(() => detectRosterDepartures({ server, gameId: id }));
  return <SplitTeamsView id={id} />;
}
