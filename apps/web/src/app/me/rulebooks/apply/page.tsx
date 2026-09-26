import type { Metadata } from "next";

import { RulebookApplyView } from "@/views/rulebook-apply";

export const metadata: Metadata = { title: "인증 신청" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ rulebook?: string | string[] }>;
}) {
  const { rulebook } = await searchParams;
  // 구인 등록 등에서 판본의 남은 책을 넘기면 첫 책의 카테고리를 열어 둔다.
  return <RulebookApplyView rulebookIds={[rulebook ?? []].flat()} />;
}
