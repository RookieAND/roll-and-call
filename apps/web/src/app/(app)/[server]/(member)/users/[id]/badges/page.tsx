import type { Metadata } from "next";

import { UserBadgesView } from "@/views/user-badges";

export const metadata: Metadata = { title: "업적" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UserBadgesView id={id} />;
}
