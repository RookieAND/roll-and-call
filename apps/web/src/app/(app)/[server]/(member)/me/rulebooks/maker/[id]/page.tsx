import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { HomebrewDetailView } from "@/views/homebrew-detail";

export const metadata: Metadata = { title: "내가 만든 룰" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireMembership();
  const { id } = await params;
  return <HomebrewDetailView applicationId={id} />;
}
