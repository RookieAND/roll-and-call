import type { Metadata } from "next";
import { Suspense } from "react";

import { requireMembership } from "@/shared/server";
import {
  RulebookApplySkeleton,
  RulebookApplyStartView,
  RulebookApplyView,
} from "@/views/rulebook-apply";

export const metadata: Metadata = { title: "룰북 신청" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ rulebook?: string | string[]; step?: string }>;
}) {
  await requireMembership();
  const { rulebook, step } = await searchParams;
  const rulebookIds = [rulebook ?? []].flat();
  if (rulebookIds.length === 0 && step !== "books") return <RulebookApplyStartView />;
  // loading.tsx는 첫 단계 모양이라, 책 고르기는 여기서 자기 스켈레톤을 건다.
  return (
    <Suspense fallback={<RulebookApplySkeleton />}>
      <RulebookApplyView rulebookIds={rulebookIds} />
    </Suspense>
  );
}
