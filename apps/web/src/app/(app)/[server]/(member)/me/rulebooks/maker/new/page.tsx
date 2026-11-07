import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { HomebrewApplyView } from "@/views/homebrew-apply";

export const metadata: Metadata = { title: "내가 만든 룰 등록 신청" };

export default async function Page({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  await requireMembership();
  const { from } = await searchParams;
  return <HomebrewApplyView from={from} />;
}
