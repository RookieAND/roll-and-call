import type { Metadata } from "next";
import { after } from "next/server";

import { detectRosterDepartures, getCurrentServer } from "@/shared/server";
import { ManageParticipantsView } from "@/views/manage-participants";

export const metadata: Metadata = { title: "참여자 관리" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, server] = await Promise.all([params, getCurrentServer()]);
  after(() => detectRosterDepartures({ server, gameId: id }));
  return <ManageParticipantsView id={id} />;
}
