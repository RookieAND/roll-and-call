import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { RulebookApplyView } from "@/views/rulebook-apply";

export const metadata: Metadata = { title: "인증 신청" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ rulebook?: string | string[] }>;
}) {
  await requireMembership();
  const { rulebook } = await searchParams;
  return <RulebookApplyView rulebookIds={[rulebook ?? []].flat()} />;
}
