import type { Metadata } from "next";

import { RulebookApplyView } from "@/views/rulebook-apply";

export const metadata: Metadata = { title: "인증 신청" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ rulebook?: string | string[] }>;
}) {
  const { rulebook } = await searchParams;
  // 여러 권을 함께 신청하면 ?rulebook=a&rulebook=b로 넘어온다.
  return <RulebookApplyView rulebookIds={[rulebook ?? []].flat()} />;
}
